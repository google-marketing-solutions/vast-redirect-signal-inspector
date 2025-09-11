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
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as styles from './style.module.css';

import {
  TAG_TYPE,
  IMPLEMENTATION_TYPE,
  EXAMPLE_VAST_URLS,
} from '../../constants';
import { decodeState } from '../../utils/encoder';
import { validateUrl, analyzeUrl } from '../../services/AnalyzerService';
import { handleNavigation } from '../../services/NavigationService';

import AppHeader from '../Header/AppHeader';
import URLInputForm from '../Form/URLInputForm';
import TagTypeSelector from '../Form/TagTypeSelector';
import ImplementationTypeSelector from '../Form/ImplementationTypeSelector';
import NotificationManager from '../Notifications/NotificationManager';
import TourManager from '../tour/TourManager';
import AnalysisResults from '../Reporting/AnalysisResults';

const TOUR_KEY = 'vast-inspector-tour-seen';

class App extends React.PureComponent {
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
      ipViaHttpHeader: false,
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
      showInputControls: true,
    };
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this);
    this.handleRefreshVast = this.handleRefreshVast.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateUrl = this.validateUrl.bind(this);
    this.handleTagTypeChange = this.handleTagTypeChange.bind(this);
    this.handleImplementationTypeChange =
      this.handleImplementationTypeChange.bind(this);
    this.handleIpViaHttpHeaderChange =
      this.handleIpViaHttpHeaderChange.bind(this);
    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleExampleClick = this.handleExampleClick.bind(this);
    this.handleTourCallback = this.handleTourCallback.bind(this);
    this.handleStartTour = this.handleStartTour.bind(this);
    this.toggleInputControls = this.toggleInputControls.bind(this);
  }

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
    if (
      !localStorage.getItem(TOUR_KEY) &&
      !(typeof window !== 'undefined' && window.__disableTour)
    ) {
      this.handleStartTour();
    }
  }

  /**
   * Validates and processes a VAST URL, updating state with validation results.
   * @param {string} url - The VAST URL to validate
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
        ipViaHttpHeader: false, // Reset IP header option for empty URLs
      });
      return;
    }

    const validationResult = validateUrl(url);
    const isPaiTag =
      validationResult.tagType === TAG_TYPE.PAI ||
      validationResult.tagType === TAG_TYPE.PAI_PAL;

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
      // Reset IP header option when switching away from PAI tags automatically
      ipViaHttpHeader: isPaiTag ? this.state.ipViaHttpHeader : false,
    });
  }

  handleChange(event) {
    const newUrl = event.target.value;
    this.setState(
      {
        vastRedirectURL: newUrl,
        showInputControls: true,
      },
      () => {
        this.validateUrl(newUrl);
      },
    );
  }

  handleTagTypeChange(event) {
    const newTagType = event.target.value;
    const isPaiTag =
      newTagType === TAG_TYPE.PAI || newTagType === TAG_TYPE.PAI_PAL;

    this.setState(
      {
        vastTagType: newTagType,
        isAnalyzeButtonDisabled: false,
        // Reset IP header option when switching away from PAI tags
        ipViaHttpHeader: isPaiTag ? this.state.ipViaHttpHeader : false,
      },
      () => {
        this.analysisResult();
      },
    );
  }

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

  handleIpViaHttpHeaderChange(event) {
    this.setState(
      {
        ipViaHttpHeader: event.target.checked,
      },
      () => {
        // Re-run analysis if we have results already
        if (this.state.analysisResult) {
          this.analysisResult();
        }
      },
    );
  }

  handleAnalyzeClick(event) {
    event.preventDefault();

    this.setState({ showInputControls: false }, () => {
      this.analysisResult();
    });
  }

  /**
   * @return {Promise<void>}
   */
  async handleRefreshVast() {
    await this.analysisResult(true); // Force refresh
  }

  toggleInputControls() {
    this.setState((prevState) => ({
      showInputControls: !prevState.showInputControls,
    }));
  }

  /**
   * Analyzes the current VAST URL and updates analysis results.
   * @param {boolean} forceRefresh - Whether to bypass cache for VAST response
   * @return {Promise<void>}
   */
  async analysisResult(forceRefresh = false) {
    const {
      vastRedirectURL,
      vastTagType,
      implementationType,
      ipViaHttpHeader,
    } = this.state;

    try {
      this.setState({ isLoading: true });

      const result = await analyzeUrl(
        vastRedirectURL,
        vastTagType,
        implementationType,
        forceRefresh,
        { ipViaHttpHeader },
      );

      this.setState({
        vastParameters: result.success ? result.vastParameters : {},
        analysisResult: result.success ? result.analysisResult : {},
        error: {
          present: !result.success,
          message: result.error ? result.error.toString() : '',
          details: result.error,
        },

        warning: result.success
          ? { present: false, message: '', details: null }
          : this.state.warning,
      });
    } catch (error) {
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
   * @param {Event} event - The click event
   * @param {string} key - The navigation key
   */
  handleToolbarClick(event, key) {
    event.preventDefault();
    if (key === 'Tour') {
      this.handleStartTour();
    } else {
      handleNavigation(key);
    }
  }

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
   * @param {Object} data - The Joyride event data
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
        this.setState(
          (prevState) => ({
            tour: {
              ...prevState.tour,
              run: false,
            },
          }),
          () => {
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
      setTimeout(() => {
        this.analysisResult();
      }, 100);
    }
  }

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
   * @return {React.ReactNode}
   * @override
   */
  render() {
    const {
      analysisResult,
      vastRedirectURL,
      vastTagType,
      detectedVastTagType,
      implementationType,
      ipViaHttpHeader,
      error,
      warning,
      showDebug,
      isAnalyzeDisabled,
      showDetectionWarning,
      tour,
      showShareSnackbar,
      showInputControls,
    } = this.state;

    const hasResults = analysisResult && Object.keys(analysisResult).length > 0;
    const containerClassName = hasResults ? '' : styles.noResultsContainer;

    return (
      <Box className={styles.mainFlexbox}>
        <TourManager
          run={tour.run}
          steps={tour.steps}
          showTour={tour.show}
          callback={this.handleTourCallback}
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

        <AppHeader
          version={VERSION}
          onNavigate={this.handleToolbarClick}
          analysisResult={analysisResult}
        />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Container
            maxWidth="lg"
            className={`${styles.container} ${containerClassName}`}
          >
            <Box className={styles.inputSection}>
              <URLInputForm
                url={vastRedirectURL}
                onChange={this.handleChange}
                onAnalyze={this.handleAnalyzeClick}
                isAnalyzeDisabled={isAnalyzeDisabled}
              />

              <Box className={styles.settingsToggleContainer}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={this.toggleInputControls}
                  startIcon={
                    showInputControls ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                  className={styles.settingsToggleButton}
                >
                  {showInputControls
                    ? 'Hide Advanced Analysis Settings'
                    : 'Show Advanced Analysis Settings'}
                </Button>
              </Box>

              <Box
                className={`${styles.advancedSettings} ${
                  showInputControls
                    ? styles.advancedSettingsVisible
                    : styles.advancedSettingsHidden
                }`}
              >
                <TagTypeSelector
                  selectedTagType={vastTagType}
                  detectedTagType={detectedVastTagType}
                  url={vastRedirectURL}
                  showWarning={showDetectionWarning}
                  tagTypes={TAG_TYPE}
                  exampleUrls={EXAMPLE_VAST_URLS}
                  onTagTypeChange={this.handleTagTypeChange}
                  onExampleClick={this.handleExampleClick}
                  additionalOptions={
                    (vastTagType === TAG_TYPE.PAI ||
                      vastTagType === TAG_TYPE.PAI_PAL) && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={ipViaHttpHeader}
                            onChange={this.handleIpViaHttpHeaderChange}
                            name="ipViaHttpHeader"
                            color="primary"
                          />
                        }
                        label="IP address is passed via HTTP header (not as URL parameter)"
                      />
                    )
                  }
                />

                <ImplementationTypeSelector
                  selectedType={implementationType}
                  implementationTypes={IMPLEMENTATION_TYPE}
                  onChange={this.handleImplementationTypeChange}
                />
              </Box>
            </Box>

            <AnalysisResults
              analysisResult={analysisResult}
              vastRedirectURL={vastRedirectURL}
              vastTagType={vastTagType}
              implementationType={implementationType}
              showDebug={showDebug}
              onShareClick={() => this.setState({ showShareSnackbar: true })}
              onRefreshVast={this.handleRefreshVast}
            />
          </Container>
        </Box>
      </Box>
    );
  }
}

export default App;
