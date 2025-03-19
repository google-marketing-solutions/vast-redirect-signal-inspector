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
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

import VastURLValidator from '../Validator/VastURLValidator';
import VastURLParser from '../Parser/VastURLParser';
import VastURLAnalyzer from '../Analyzer/VastURLAnalyzer';
import VastURLParameters from '../Reporting/VastURLParameters';
import { TAG_TYPE, IMPLEMENTATION_TYPE } from '../../constants';
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
      error: null,
    };
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateUrl = this.validateUrl.bind(this);
    this.handleTagTypeChange = this.handleTagTypeChange.bind(this);
    this.handleImplementationTypeChange =
      this.handleImplementationTypeChange.bind(this);
  }

  /**
   * Check if we have a redirect URL in the URL parameters.
   */
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    if (redirectUrl) {
      this.setState({ vastRedirectURL: redirectUrl }, () => {
        this.validateUrl(redirectUrl);
        this.analysisResult();
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
        detectedVastTagType: validationResult.tagType,
        vastTagType: validationResult.tagType,
      });
    } else {
      this.setState({
        error: validationResult.error,
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
      parseResult.params,
      this.state.vastTagType,
      this.state.implementationType,
    );
    const analysisResult = analyzer.analyze();
    if (!analysisResult.success) {
      await new Promise((resolve) => {
        this.setState(
          { error: analysisResult.error, analysisResult: {} },
          resolve,
        );
      });
      return;
    }
    await new Promise((resolve) => {
      this.setState({ analysisResult: analysisResult }, resolve);
    });
  }

  /**
   * @return {Object}
   */
  render() {
    const {
      error,
      detectedVastTagType,
      implementationType,
      vastTagType,
      analysisResult,
    } = this.state;
    const showDetectionWarning =
      vastTagType && detectedVastTagType && vastTagType !== detectedVastTagType;
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 5,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          VAST Redirect Signal Inspector
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
            value={this.state.vastRedirectURL}
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
            disabled={this.state.vastTagType === TAG_TYPE.UNKNOWN}
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
          </FormControl>
          {showDetectionWarning && (
            <Tooltip title="Manually selected tag type does not match the automatically detected tag type.">
              <IconButton aria-label="warning" color="warning">
                <WarningIcon />
              </IconButton>
            </Tooltip>
          )}
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
        {error && <Typography color="error">{error}</Typography>}

        {analysisResult && Object.keys(analysisResult).length > 0 && (
          <VastURLScore data={analysisResult} />
        )}

        {analysisResult && Object.keys(analysisResult).length > 0 && (
          <VastURLParameters data={analysisResult} />
        )}
      </Container>
    );
  }
}

export default App;
