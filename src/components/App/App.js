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

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VastURLValidator from '../Validator/VastURLValidator';
import VastURLParser from '../Parser/VastURLParser';
import VastURLAnalyzer from '../Analyzer/VastURLAnalyzer';
import VastURLParameters from '../Reporting/VastURLParameters';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import HelpIcon from '@mui/icons-material/Help';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';

import {
  TAG_TYPE,
  IMPLEMENTATION_TYPE,
  EXAMPLE_VAST_URLS,
} from '../../constants';
import { decodeState } from '../../utils/encoder';
import ShareButton from '../Button/ShareButton';
import VastURLScore from '../Reporting/VastURLScore';

/**
 * @class
 */
class App extends React.Component {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      vastRedirectURL: '',
      vastTagType: TAG_TYPE.UNKNOWN,
      detectedVastTagType: TAG_TYPE.UNKNOWN,
      implementationType: IMPLEMENTATION_TYPE.WEB,
      vastParameters: {},
      analysisResult: null,
      showShareSnackbar: false,
      error: null,
      error_message: '',
      warning: null,
      warning_message: '',
    };
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateUrl = this.validateUrl.bind(this);
    this.handleTagTypeChange = this.handleTagTypeChange.bind(this);
    this.handleImplementationTypeChange =
      this.handleImplementationTypeChange.bind(this);
    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleExampleClick = this.handleExampleClick.bind(this);
  }

  /**
   * Check if we have a redirect URL in the URL parameters.
   */
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
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
   * @param {string} url
   */
  validateUrl(url) {
    const validator = new VastURLValidator(url);
    const validationResult = validator.validate();
    if (validationResult.success) {
      this.setState({
        error: null,
        error_message: '',
        warning: validationResult.warning,
        warning_message: validationResult.warning_message,
        detectedVastTagType: validationResult.tagType,
        vastTagType: validationResult.tagType,
      });
    } else {
      this.setState({
        error: validationResult.error,
        error_message: validationResult.error_message,
        detectedVastTagType: validationResult.tagType,
        vastTagType: validationResult.tagType,
      });
    }
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
   * @return {Promise}
   */
  async analysisResult() {
    const { vastRedirectURL } = this.state;

    // Parse URL
    const parser = new VastURLParser(vastRedirectURL);
    const parseResult = parser.parse();
    if (!parseResult.success) {
      await new Promise((resolve) => {
        this.setState(
          {
            error: parseResult.error,
            vastParameters: {},
            analysisResult: {},
          },
          resolve,
        );
      });
      return;
    }
    await new Promise((resolve) => {
      this.setState({ vastParameters: parseResult.params }, resolve);
    });

    // Analyze URL
    const analyzer = new VastURLAnalyzer(
      vastRedirectURL,
      parseResult.params,
      this.state.vastTagType,
      this.state.implementationType,
    );
    const analyzerResult = analyzer.analyze();
    if (!analyzerResult.success) {
      await new Promise((resolve) => {
        this.setState(
          { error: analyzerResult.error, analysisResult: {} },
          resolve,
        );
      });
      return;
    }
    await new Promise((resolve) => {
      this.setState({ analysisResult: analyzerResult.analysisResult }, resolve);
    });
  }

  /**
   * @param {*} event
   * @param {string} key
   */
  handleToolbarClick(event, key) {
    event.preventDefault();
    switch (key) {
      case 'Home':
        window.location.href = '/vast-redirect-signal-inspector/';
        break;
      case 'Source':
        window.open(
          'https://github.com/google-marketing-solutions/vast-redirect-signal-inspector',
        );
        break;
      case 'Issues':
        window.open(
          'https://github.com/google-marketing-solutions/vast-redirect-signal-inspector/issues',
        );
        break;
      default:
        break;
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
   * @return {Object}
   */
  render() {
    const {
      error,
      error_message,
      warning,
      warning_message,
      detectedVastTagType,
      implementationType,
      showShareSnackbar,
      vastTagType,
      vastRedirectURL,
      analysisResult,
    } = this.state;
    const showDetectionWarning =
      vastTagType &&
      detectedVastTagType &&
      vastRedirectURL &&
      vastTagType !== detectedVastTagType;

    // Navigation items
    const navItems = [
      { name: 'Home', icon: <HomeIcon /> },
      { name: 'Source', icon: <CodeIcon /> },
      { name: 'Issues', icon: <BugReportIcon /> },
      { name: 'Help', icon: <HelpIcon /> },
      { name: 'About', icon: <InfoIcon /> },
    ];

    return (
      <Box sx={{ display: 'flex' }}>
        {error && (
          <Snackbar
            open={open}
            autoHideDuration={10000}
            onClose={() => this.setState({ error: null })}
            sx={{ width: '100%' }}
          >
            <Alert
              severity="error"
              onClose={() => this.setState({ error: null })}
            >
              {error_message ? error_message : error}
            </Alert>
          </Snackbar>
        )}
        {warning && (
          <Snackbar
            open={open}
            autoHideDuration={10000}
            onClose={() => this.setState({ warning: null })}
            sx={{ width: '100%' }}
          >
            <Alert
              severity="warning"
              onClose={() => this.setState({ warning: null })}
            >
              {warning_message ? warning_message : warning}
            </Alert>
          </Snackbar>
        )}
        {showShareSnackbar && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            onClose={() => this.setState({ showShareSnackbar: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => this.setState({ showShareSnackbar: false })}
              severity="success"
              sx={{ width: '100%' }}
            >
              Shareable URL copied to clipboard!
            </Alert>
          </Snackbar>
        )}

        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => {}}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'none', sm: 'block', verticalAlign: 'middle' },
              }}
            >
              <img
                src="https://raw.githubusercontent.com/google-marketing-solutions/vast-redirect-signal-inspector/main/assets/png/logo_home.png"
                alt="Logo"
                style={{
                  height: '0.7em',
                  width: 'auto',
                  verticalAlign: 'middle',
                  margin: '0 10px 5px 0',
                }}
              />
              VAST Signal Inspector
              <span
                style={{
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  fontSize: '0.7em',
                  marginLeft: '5px',
                }}
              >
                Beta
              </span>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  sx={{
                    color: '#fff',
                    gap: 1,
                  }}
                  onClick={(event) => this.handleToolbarClick(event, item.name)}
                >
                  {item.icon}
                  {item.name}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                mb: 2,
              }}
            >
              <TextField
                label="Vast Redirect URL"
                value={vastRedirectURL}
                variant="outlined"
                fullWidth
                sx={{ mr: 2 }}
                onChange={this.handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this.handleAnalyzeClick}
                disabled={
                  !vastRedirectURL ||
                  (analysisResult &&
                    Object.keys(analysisResult).length > 0 &&
                    vastRedirectURL === analysisResult.url)
                }
              >
                Analyze
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <FormControl component="fieldset" sx={{ display: 'inline-flex' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {showDetectionWarning && (
                    <Tooltip title="Manually selected tag type does not match the automatically detected tag type.">
                      <IconButton aria-label="warning" color="warning">
                        <WarningIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <RadioGroup
                    aria-label="vast-tag-type"
                    name="vastTagType"
                    value={vastTagType}
                    onChange={this.handleTagTypeChange}
                    row
                  >
                    {Object.values(TAG_TYPE).map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      />
                    ))}
                  </RadioGroup>
                  <Button
                    variant="outlined"
                    onClick={this.handleExampleClick}
                    sx={{ ml: 2 }}
                    disabled={
                      EXAMPLE_VAST_URLS[vastTagType] === undefined ||
                      vastRedirectURL === EXAMPLE_VAST_URLS[vastTagType]
                    }
                  >
                    Load Example
                  </Button>
                </Box>
              </FormControl>
            </Box>
            <FormControl
              component="fieldset"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              {' '}
              <Typography variant="body1">Implementation Type:</Typography>
              <RadioGroup
                aria-label="implementation-type"
                name="implementationType"
                value={implementationType}
                onChange={this.handleImplementationTypeChange}
                row
              >
                {Object.values(IMPLEMENTATION_TYPE).map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {analysisResult && Object.keys(analysisResult).length > 0 && (
              <VastURLScore data={analysisResult} />
            )}

            {analysisResult && Object.keys(analysisResult).length > 0 && (
              <ShareButton
                state={{
                  vastRedirectURL,
                  vastTagType,
                  implementationType,
                }}
                onShare={() => this.setState({ showShareSnackbar: true })}
                disabled={vastRedirectURL !== analysisResult.url}
              />
            )}

            {analysisResult && Object.keys(analysisResult).length > 0 && (
              <VastURLParameters data={analysisResult} />
            )}
          </Container>
        </Box>
      </Box>
    );
  }
}

export default App;
