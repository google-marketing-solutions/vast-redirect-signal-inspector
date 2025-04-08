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

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
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

import { TAG_TYPE, IMPLEMENTATION_TYPE } from '../../constants';
import VastURLScore from '../Reporting/VastURLScore';

// Example URLs
const examples = {
  [TAG_TYPE.IMA_SDK]:
    'https://pagead2.googlesyndication.com/gampad/ads?iu=%2F21775744923%2Fexternal%2Fsingle_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=fluid%7C728x90%2Cfluid%7C300x250%2Cfluid%7C180x150%2Cfluid%7C120x60%2Cfluid%7C88x31%2Cfluid%7C300x60%2Cfluid%7C300x100%2Cfluid%7C320x50%2Cfluid%7C468x60%2Cfluid%7C300x600%2Cfluid%7C160x600&gdfp_req=1&output=xml_vast4&unviewed_position_start=1&env=vp&correlator=2920090807217010&sdkv=h.3.688.0&osd=2&frm=0&vis=1&sdr=1&hl=en&afvsz=200x200%2C250x250%2C300x250%2C450x50%2C468x60%2C480x70&is_amp=0&uach=WyJtYWNPUyIsIjE1LjMuMSIsImFybSIsIiIsIjEzMy4wLjY5NDMuMTQzIixudWxsLDAsbnVsbCwiNjQiLFtbIk5vdChBOkJyYW5kIiwiOTkuMC4wLjAiXSxbIkdvb2dsZSBDaHJvbWUiLCIxMzMuMC42OTQzLjE0MyJdLFsiQ2hyb21pdW0iLCIxMzMuMC42OTQzLjE0MyJdXSwwXQ..&u_so=l&ctv=0&mpt=h5_vsi&sdki=445&ptt=20&adk=1083529519&sdk_apis=2%2C7%2C8&omid_p=Google1%2Fh.3.688.0&media_url=https%3A%2F%2Fs0.2mdn.net%2F4253510%2Fgoogle_ddm_animation_480P.mp4&sid=143B1AB4-F655-425F-B5C2-D49BC807C875&nel=1&td=1&eid=95322027%2C95326337%2C95331589%2C95332046%2C95351091&ref=https%3A%2F%2Fwww.google.com%2F&url=https%3A%2F%2Fgoogleads.github.io%2Fgoogleads-ima-html5%2Fvsi%2F&dlt=1741201107292&idt=496&dt=1741201112814&pvsid=342258371105668&scor=768096627554145',
  [TAG_TYPE.PAL]:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&givn=AQzzBGQEVGjRW4svCeU1wKejaeWhATJKF8aSNC5L1tYtef8HbnrkSGMNeJ_9T2TlaiR1_a3raO06REP-0GXOufeAFhKUqEGb1jr_GnFF2JPkIb2XSoHFulgoqv_LT-eSbtLoyvth8twEDkitZc_x5oG7ZeM5HG9p0uN7PsxNozcRzSKJ0YR8r3piDMICB0dHo3QinJJe8WbesSgoTC3sLMnSZPxyKr9HO_PNq01x6S9wdaoPSomG6yBt-zu19Sb-PmILZa4Pax0P_moNAZHLTo7RIaPHeCj3qTdLVplhhC2lWwFLrSiHXeDefaoi4sl4elyvItt6KKGoRjAAwQAuyDNFWxGMghrGF5Z0N7-BANG7dutg-K78XPB9m5SBCEYPU_lFrGjs9zii9QxKPpj7pkn-4FuEov6jXwuYG1TRHLjYFrHR4uYDgeIDwWFGyIxIpsFUESrjO2BqP5EZ7F_TOJ98-TkaoV4B0_da60y08VZZqOT0n_hxZDlPDzxCNFRWdBoFEN7PLR_4N-t0Tm0PuJgiWiye0W5_7HXyiTvIEgdFiiLwwmFsB5d72vUaKYJi1HOc9eJSEjC7YOG6ag0kqP1C61dW1BAVuAb0OFR5UJk0zA10cjgQULeHvC0BCIvLL5qcxBKEvUCHmV4RC6oe4bk3u3tVwe7lynNjFbNvAitgbbJum_38R_8V1dYNj-YGApbIuq4nfD9PWQpHodG2c9TfFhOufJ6MDeVaJPCFF9bprUf63MqPmGGjV4-sBW0GUizqRc6XMkdp3pt1cpVli6jqHqDV4tYvfXS9pLgXbdR9u3YaFK2rZQWphq5JClbWWvPAOsesmHTtRXQ6SlJR_dLd2GPfIR3HO3Y7qATwiRiYXkFFTw..&correlator=',
  [TAG_TYPE.PAI]:
    'https://serverside.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&ssss=vast_url_validator_test&ip=1.2.3.4&correlator=',
  [TAG_TYPE.STANDARD]:
    'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=',
};

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
    this.handleToolbarClick = this.handleToolbarClick.bind(this);
    this.handleExampleClick = this.handleExampleClick.bind(this);
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
    console.log(vastTagType);
    const exampleUrl = examples[vastTagType];
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
      detectedVastTagType,
      implementationType,
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
                      vastTagType === TAG_TYPE.UNKNOWN ||
                      vastRedirectURL === examples[vastTagType]
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
            {error && <Typography color="error">{error}</Typography>}

            {analysisResult && Object.keys(analysisResult).length > 0 && (
              <VastURLScore data={analysisResult} />
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
