/**
 * @license Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Main app for the VAST Redirect Signal Inspector.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

import {
  TAG_TYPE,
  IMPLEMENTATION_TYPE,
  EXAMPLE_VAST_URLS,
} from '../../constants';
import { decodeState } from '../../utils/encoder';
import {
  validateUrl,
  analyzeUrl,
  handleNavigation,
} from '../../services/AnalyzerService';

// Import components
import AppHeader from '../Header/AppHeader';
import URLInputForm from '../Form/URLInputForm';
import TagTypeSelector from '../Form/TagTypeSelector';
import ImplementationTypeSelector from '../Form/ImplementationTypeSelector';
import NotificationManager from '../Notifications/NotificationManager';
import TourManager from '../tour/TourManager';
import AnalysisResults from '../Reporting/AnalysisResults';

// Constants
const TOUR_KEY = 'vast-inspector-tour-seen';

/**
 * @class
 */
class App extends React.PureComponent {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      vastRedirectURL: '',
      vastTagType: TAG_TYPE.STANDARD,
      detectedVastTagType: TAG_TYPE.UNKNOWN,
      implementationType: IMPLEMENTATION_TYPE.WEB,
      vastParameters: {},
      analysisResult: null,
      showShareSnackbar: false,
      showDebug: false,
      error: {
        present: false,
        message: '',
      },
      warning: {
        present: false,
        message: '',
      },
      tour: {
        run: false,
        steps: [],
        show: false,
      },
    };
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateUrl = this.validateUrl.bind(this);
    this.handleTagTypeChange = this.handleTagTypeChange.bind(this);
    this.handleImplementationTypeChange =
      this.handleImplementationTypeChange.bind(this);
    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleExampleClick = this.handleExampleClick.bind(this);
    this.handleTourCallback = this.handleTourCallback.bind(this);
    this.handleStartTour = this.handleStartTour.bind(this);
  }

  /**
   * Check if we have a redirect URL in the URL parameters.
   */
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for debug mode in the URL parameters
    if (urlParams.get('debug') === '1') {
      this.setState({ showDebug: true });
      console.log('Debug mode enabled');
    }

    // Check for encoded data or redirect URL in the URL parameters
    const encodedData = urlParams.get('data');
    const redirectUrl = urlParams.get('redirect');
    if (encodedData) {
      const decoded = decodeState(encodedData);
      if (decoded && decoded.vastRedirectURL) {
        console.log('Use decoded state', decoded);
        this.setState(
          {
            ...decoded,
          },
          () => {
            this.validateUrl(decoded.vastRedirectURL);
            this.analysisResult();
            const url = new URL(window.location.href);
            url.searchParams.delete('data');
            window.history.replaceState({}, document.title, url.pathname);
          },
        );
      }
    } else if (redirectUrl) {
      console.log('Use redirect URL', redirectUrl);
      this.setState({ vastRedirectURL: redirectUrl }, () => {
        this.validateUrl(redirectUrl);
        this.analysisResult();
        const url = new URL(window.location.href);
        url.searchParams.delete('redirect');
        window.history.replaceState({}, document.title, url.pathname);
      });
    }

    // Joyride Setup
    if (!localStorage.getItem(TOUR_KEY)) {
      this.handleStartTour();
    }
  }

  /**
   * @param {string} url
   */
  validateUrl(url) {
    // Skip validation for empty URLs
    if (!url || url.trim() === '') {
      this.setState({
        error: {
          present: false,
          message: '',
          details: null,
        },
        warning: {
          present: false,
          message: '',
          details: null,
        },
        detectedVastTagType: TAG_TYPE.UNKNOWN,
      });
      return;
    }

    const validationResult = validateUrl(url);
    this.setState({
      error: {
        present: !validationResult.success,
        message: validationResult.error_message || '',
        details: validationResult.error,
      },
      warning: {
        present: !!validationResult.warning,
        message: validationResult.warning_message || '',
        details: validationResult.warning,
      },
      detectedVastTagType: validationResult.tagType,
      vastTagType: validationResult.tagType,
    });
  }

  /**
   * @param {*} event
   */
  handleChange(event) {
    const newUrl = event.target.value;
    this.setState({ vastRedirectURL: newUrl }, () => {
      this.validateUrl(newUrl);
    });
  }

  /**
   * @param {*} event
   */
  handleTagTypeChange(event) {
    this.setState(
      {
        vastTagType: event.target.value,
        isAnalyzeButtonDisabled: false,
      },
      () => {
        this.analysisResult();
      },
    );
  }

  /**
   * @param {*} event
   */
  handleImplementationTypeChange(event) {
    this.setState(
      {
        implementationType: event.target.value,
      },
      () => {
        this.analysisResult();
      },
    );
  }

  /**
   * @param {*} event
   */
  handleAnalyzeClick(event) {
    event.preventDefault();
    this.analysisResult();
  }

  /**
   * Performs URL analysis and updates state with results
   * @return {Promise<void>}
   */
  async analysisResult() {
    const { vastRedirectURL, vastTagType, implementationType } = this.state;

    try {
      this.setState({ isLoading: true });

      const result = await analyzeUrl(
        vastRedirectURL,
        vastTagType,
        implementationType,
      );

      // Update state with analysis results
      this.setState({
        vastParameters: result.success ? result.vastParameters : {},
        analysisResult: result.success ? result.analysisResult : {},
        error: {
          present: !result.success,
          message: result.error ? result.error.toString() : '',
          details: result.error,
        },
        // Reset warning if analysis was successful
        warning: result.success
          ? { present: false, message: '', details: null }
          : this.state.warning,
      });
    } catch (error) {
      // Handle unexpected errors
      console.error('Analysis failed:', error);
      this.setState({
        error: {
          present: true,
          message: 'An unexpected error occurred during analysis.',
          details: error,
        },
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  /**
   * @param {*} event
   * @param {string} key
   */
  handleToolbarClick(event, key) {
    event.preventDefault();
    if (key === 'Tour') {
      this.handleStartTour();
    } else {
      handleNavigation(key);
    }
  }

  /**
   * @param {*} event
   */
  handleExampleClick(event) {
    event.preventDefault();
    const { vastTagType } = this.state;
    const exampleUrl = EXAMPLE_VAST_URLS[vastTagType];
    if (exampleUrl) {
      this.setState({ vastRedirectURL: exampleUrl }, () => {
        this.validateUrl(exampleUrl);
        this.analysisResult();
      });
    }
  }

  /**
   * @param {Object} data - The Joyride event data.
   */
  handleTourCallback(data) {
    const { status, index, type } = data;
    const { vastRedirectURL } = this.state;

    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem(TOUR_KEY, '1');
      this.setState((prevState) => ({
        tour: {
          ...prevState.tour,
          run: false,
        },
      }));
    } else if (index === 0 && !vastRedirectURL) {
      const exampleUrl = EXAMPLE_VAST_URLS[TAG_TYPE.STANDARD];
      this.setState({ vastRedirectURL: exampleUrl }, () => {
        this.validateUrl(exampleUrl);

        // First hide tour
        this.setState(
          (prevState) => ({
            tour: {
              ...prevState.tour,
              run: false,
            },
          }),
          () => {
            // Then show tour after a short delay to ensure re-render
            setTimeout(
              () =>
                this.setState((prevState) => ({
                  tour: {
                    ...prevState.tour,
                    run: true,
                  },
                })),
              100,
            );
          },
        );
      });
    } else if (index === 3 && type === 'step:after') {
      // Analyze button step - trigger analysis and ensure proper timing
      setTimeout(() => {
        this.analysisResult();
      }, 100);
    }
  }

  /**
   * Lazy loads the tour steps and starts the tour
   */
  handleStartTour() {
    if (!this.state.tour.steps.length) {
      import('../tour/TourSteps')
        .then((module) => {
          this.setState(() => ({
            tour: {
              steps: module.default,
              run: true,
              show: true,
            },
          }));
        })
        .catch((error) => {
          console.error('Failed to load tour steps:', error);
        });
    } else {
      this.setState((prevState) => ({
        tour: {
          ...prevState.tour,
          run: true,
          show: true,
        },
      }));
    }
  }

  /**
   * @param {string} tagType - The selected tag type
   * @param {string} detectedType - The detected tag type
   * @param {string} url - The URL being analyzed
   * @return {boolean} Whether to show the warning
   */
  shouldShowDetectionWarning(tagType, detectedType, url) {
    return tagType && detectedType && url && tagType !== detectedType;
  }

  /**
   * @param {string} url - The URL to analyze
   * @param {Object} result - The current analysis result
   * @return {boolean} Whether the analyze button should be disabled
   */
  isAnalyzeButtonDisabled(url, result) {
    return (
      !url || (result && Object.keys(result).length > 0 && url === result.url)
    );
  }

  /**
   * @return {Object}
   */
  render() {
    const {
      error,
      warning,
      detectedVastTagType,
      implementationType,
      showDebug,
      showShareSnackbar,
      vastTagType,
      vastRedirectURL,
      analysisResult,
      tour,
    } = this.state;

    // Use memoized helper methods for derived state
    const showDetectionWarning = this.shouldShowDetectionWarning(
      vastTagType,
      detectedVastTagType,
      vastRedirectURL,
    );

    const isAnalyzeDisabled = this.isAnalyzeButtonDisabled(
      vastRedirectURL,
      analysisResult,
    );

    return (
      <Box sx={{ display: 'flex' }}>
        <TourManager
          run={tour.run}
          steps={tour.steps}
          callback={this.handleTourCallback}
          showTour={tour.show}
        />

        <NotificationManager
          error={error.present ? error.message || true : null}
          errorMessage={error.message}
          onErrorClose={() =>
            this.setState({
              error: { present: false, message: '', details: null },
            })
          }
          warning={warning.present ? warning.message || true : null}
          warningMessage={warning.message}
          onWarningClose={() =>
            this.setState({
              warning: { present: false, message: '', details: null },
            })
          }
          showShareSuccess={showShareSnackbar}
          onShareClose={() => this.setState({ showShareSnackbar: false })}
        />

        <AppHeader version={VERSION} onNavigate={this.handleToolbarClick} />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{
              mt: 5,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <URLInputForm
              url={vastRedirectURL}
              onChange={this.handleChange}
              onAnalyze={this.handleAnalyzeClick}
              isAnalyzeDisabled={isAnalyzeDisabled}
            />

            <TagTypeSelector
              selectedTagType={vastTagType}
              detectedTagType={detectedVastTagType}
              url={vastRedirectURL}
              showWarning={showDetectionWarning}
              tagTypes={TAG_TYPE}
              exampleUrls={EXAMPLE_VAST_URLS}
              onTagTypeChange={this.handleTagTypeChange}
              onExampleClick={this.handleExampleClick}
            />

            <ImplementationTypeSelector
              selectedType={implementationType}
              implementationTypes={IMPLEMENTATION_TYPE}
              onChange={this.handleImplementationTypeChange}
            />

            <AnalysisResults
              analysisResult={analysisResult}
              vastRedirectURL={vastRedirectURL}
              vastTagType={vastTagType}
              implementationType={implementationType}
              showDebug={showDebug}
              onShareClick={() => this.setState({ showShareSnackbar: true })}
            />
          </Container>
        </Box>
      </Box>
    );
  }
}

export default App;
