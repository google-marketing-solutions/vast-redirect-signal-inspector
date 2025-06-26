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
 * @fileoverview VAST URL Parameters Reporting component.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import vastAdTagParameters from '../../parameter/vastAdTagParameters.json';
import sdkParameters from '../../parameter/sdkParameters.json';

import * as styles from './style.module.css';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
  width: '100%',
  overflowX: 'auto',
  [theme.breakpoints.up('md')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  fontWeight: 'bold',
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0.5),
      fontSize: '0.75rem',
    },
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  '&.value-cell': {
    [theme.breakpoints.up('md')]: {
      maxWidth: '60%',
      width: '60%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '65%',
      width: '65%',
    },
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 0.5),
    fontSize: '0.75rem',
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
    },
  },
}));

/**
 * @param {Object} props Component props
 * @param {string} props.text The text content to display
 * @param {number} props.maxLength Maximum length before collapsing (default: 100)
 * @return {React.ReactNode}
 */
function CollapsibleText({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const shouldCollapse = text && text.length > maxLength;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (!shouldCollapse) {
    return <span>{text}</span>;
  }

  return (
    <div
      className={styles.collapsibleText}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? (
        <div className={styles.expandedText}>
          {text}
          <button
            className={styles.expandCollapseButton}
            onClick={toggleExpand}
          >
            Collapse
          </button>
        </div>
      ) : (
        <>
          <span className={styles.collapsedText} title="Click to expand">
            {text.substring(0, maxLength)}...
          </span>
          <button
            className={styles.expandCollapseButton}
            onClick={toggleExpand}
          >
            Expand
          </button>
        </>
      )}
    </div>
  );
}

CollapsibleText.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

/**
 * @class
 */
class VastURLParameters extends React.PureComponent {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
  }

  /**
   * @param {string} name
   * @return {string}
   */
  getVastAdTagParameterDeprecation = (name) => {
    if (!vastAdTagParameters) {
      return '';
    }
    for (const item of vastAdTagParameters) {
      if (item.name === name) {
        return item.deprecated;
      }
    }
    return '';
  };

  /**
   * @param {string} name
   * @return {string}
   */
  getVastAdTagParameterDescription = (name) => {
    if (!vastAdTagParameters) {
      return '';
    }
    for (const item of vastAdTagParameters) {
      if (item.name === name) {
        return item.description;
      }
    }
    return '';
  };

  /**
   * @param {string} name
   * @return {string}
   */
  getVastAdTagParameterHelp = (name) => {
    if (!vastAdTagParameters) {
      return '';
    }
    for (const item of vastAdTagParameters) {
      if (item.name === name) {
        return item.help;
      }
    }
    return '';
  };

  /**
   * Get specific SDK handling info for a parameter by name.
   * @param {string} name The name of the parameter.
   * @return {string} The SDK handling info message, or a default message if not found.
   */
  getSdkHandlingInfo = (name) => {
    for (const param of sdkParameters) {
      if (param.name === name && param.sdkHandlingInfo) {
        return param.sdkHandlingInfo;
      }
    }
    return 'Note: This parameter is typically managed by an SDK.';
  };

  /**
   * @param {string} name
   * @return {string}
   */
  getVastAdTagParameterWarn = (name) => {
    if (!vastAdTagParameters) {
      return '';
    }

    const paramDef = vastAdTagParameters.find((item) => item.name === name);
    if (!paramDef) {
      return 'Parameter value is accepted but not recommended';
    }

    if (
      paramDef.validation === '^(0|1)$' &&
      paramDef.accepted &&
      paramDef.accepted.validation === '^(false|true)$'
    ) {
      // Special case for vpmute
      if (paramDef.name === 'vpmute') {
        return "Values 'false' and 'true' are accepted but not recommended.\nPlease use '0' and '1' instead, if possible.\nThis warning could be ignored for VMAP and AdRule requests!";
      }

      return "Values 'false' and 'true' are accepted but not recommended. Please use '0' and '1' instead.";
    }

    return 'Parameter value is accepted but not recommended';
  };

  /**
   * @param {*} ppsjValue The ppsj parameter value
   * @return {React.ReactNode} Formatted ppsj value display
   */
  formatPpsjValue = (ppsjValue) => {
    if (!ppsjValue) {
      return (
        <Typography variant="body2" component="span">
          {String(ppsjValue || 'N/A')}
        </Typography>
      );
    }

    // Handle string values that might be JSON strings
    if (typeof ppsjValue === 'string') {
      try {
        const jsonObject = JSON.parse(ppsjValue);
        ppsjValue = jsonObject;
      } catch {
        return (
          <Typography variant="body2" component="span">
            <CollapsibleText text={ppsjValue} maxLength={120} />
          </Typography>
        );
      }
    }

    try {
      const formattedJson = JSON.stringify(ppsjValue, null, 2);
      return (
        <div className={styles.valueContainer}>
          <pre className={styles.jsonValueContainer}>{formattedJson}</pre>
        </div>
      );
    } catch {
      return (
        <Typography variant="body2" component="span">
          {String(ppsjValue)}
        </Typography>
      );
    }
  };

  /**
   * @param {*} params
   * @param {string} title
   * @param {boolean} showDebug
   * @return {React.ReactNode}
   */
  renderTable = (params, title, showDebug = false) => {
    if (!params) return null;

    return (
      <div
        style={{ marginBottom: '20px' }}
        className={`vast-url-parameters vast-url-parameters-${title.toLowerCase().replace(/\s/g, '-')}`}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              fontSize: '1rem',
            },
          })}
        >
          {title}
        </Typography>
        <div style={{ overflowX: 'hidden', width: '100%' }}>
          <StyledTableContainer component={Paper}>
            <Table
              size="small"
              sx={{
                width: '100%',
                tableLayout: { xs: 'auto', md: 'fixed' },
                borderCollapse: 'collapse',
              }}
            >
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: '25px' }}>
                    Status
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: { xs: '50px', md: '15%' } }}>
                    Parameter
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '15px' }}>
                    {/* Help column */}
                  </StyledTableCell>
                  <StyledTableCell className={styles.tableValueCell}>
                    Value
                  </StyledTableCell>
                  {showDebug && (
                    <StyledTableCell sx={{ width: '50px' }}>
                      Score
                    </StyledTableCell>
                  )}
                  {/* Add an empty cell for the overlay column to match the data rows */}
                  <StyledTableCell
                    sx={{ width: 0, padding: 0 }}
                  ></StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {Object.values(params).map((param) => (
                  <StyledTableRow
                    key={param.name}
                    style={{ position: 'relative' }}
                  >
                    <StyledTableCell sx={{ width: '50px' }}>
                      {param.exists ? (
                        param.valid ? (
                          this.getVastAdTagParameterDeprecation(param.name) ? (
                            <Tooltip
                              title={
                                'Deprecated: ' +
                                this.getVastAdTagParameterDeprecation(
                                  param.name,
                                )
                              }
                            >
                              <CheckCircleOutlineIcon
                                style={{ color: 'orange' }}
                              />
                            </Tooltip>
                          ) : param.accepted ? (
                            <Tooltip
                              title={this.getVastAdTagParameterWarn(param.name)}
                            >
                              <CheckCircleOutlineIcon
                                style={{ color: 'orange' }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Valid">
                              <CheckCircleOutlineIcon
                                style={{ color: 'green' }}
                              />
                            </Tooltip>
                          )
                        ) : (
                          <Tooltip title="Warning: Invalid">
                            <WarningAmberIcon style={{ color: 'orange' }} />
                          </Tooltip>
                        )
                      ) : (
                        <Tooltip title="Missing">
                          <ErrorOutlineIcon style={{ color: 'red' }} />
                        </Tooltip>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={this.getVastAdTagParameterDescription(
                          param.name,
                        )}
                      >
                        <span>{param.name}</span>
                      </Tooltip>
                      {param.alias && (
                        <Tooltip title="Alias">
                          <span
                            style={{
                              fontSize: '0.8rem',
                              marginLeft: '5px',
                              color: '#888',
                            }}
                          >
                            ({param.alias})
                          </span>
                        </Tooltip>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {this.getVastAdTagParameterHelp(param.name) && (
                        <a
                          href={this.getVastAdTagParameterHelp(param.name)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <HelpCenterIcon
                            style={{ fontSize: '1rem', marginLeft: '5px' }}
                          />
                        </a>
                      )}
                    </StyledTableCell>
                    <StyledTableCell className="value-cell">
                      {param.value && typeof param.value === 'object' ? (
                        param.name === 'ppsj' ? (
                          this.formatPpsjValue(param.value)
                        ) : Object.keys(param.value).length > 0 ? (
                          <div className={styles.valueContainer}>
                            <ul className={styles.objectList}>
                              {Object.entries(param.value).map(
                                ([key, value]) => (
                                  <li
                                    key={key}
                                    className={styles.objectListItem}
                                  >
                                    <span className={styles.objectKey}>
                                      {key}:
                                    </span>
                                    <span className={styles.objectValue}>
                                      {typeof value === 'object' ? (
                                        <div className={styles.scrollableValue}>
                                          {JSON.stringify(value, null, 2)}
                                        </div>
                                      ) : typeof value === 'string' &&
                                        value.length > 100 ? (
                                        <CollapsibleText
                                          text={value}
                                          maxLength={100}
                                        />
                                      ) : (
                                        value
                                      )}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        ) : (
                          <Typography variant="body2" component="span">
                            {}
                          </Typography>
                        )
                      ) : param.name === 'ppsj' && param.value ? (
                        this.formatPpsjValue(param.value)
                      ) : (
                        <Typography variant="body2" component="span">
                          {param.value !== undefined && param.value !== null ? (
                            typeof param.value === 'string' &&
                            param.value.length > 100 ? (
                              <CollapsibleText
                                text={param.value}
                                maxLength={100}
                              />
                            ) : (
                              param.value
                            )
                          ) : (
                            'N/A'
                          )}
                        </Typography>
                      )}
                    </StyledTableCell>
                    {showDebug && (
                      <StyledTableCell>{param.score}</StyledTableCell>
                    )}
                    <StyledTableCell
                      className={styles.vastUrlParametersOverlay}
                      colSpan={showDebug ? 6 : 5}
                    >
                      {param.override && (
                        <div
                          className={styles.vastUrlParametersOverrideOverlay}
                        >
                          Overridden by the PAL SDK Nonce !
                        </div>
                      )}
                      {param.sdkManaged && (
                        <Tooltip title={this.getSdkHandlingInfo(param.name)}>
                          <div className={styles.vastUrlParametersSdkOverlay}>
                            SDK Managed Parameter
                          </div>
                        </Tooltip>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </div>
      </div>
    );
  };

  /**
   * @return {React.ReactNode}
   * @override
   */
  render() {
    const { data, showDebug } = this.props;
    const analysisResult = data || {};
    return (
      <div style={{ maxWidth: '100%', width: '100%', margin: '0 auto' }}>
        {this.renderTable(
          analysisResult.requiredParameters,
          'Required Parameters',
          showDebug,
        )}
        {this.renderTable(
          analysisResult.programmaticRequiredParameters,
          'Required Programmatic Parameters',
          showDebug,
        )}
        {this.renderTable(
          analysisResult.programmaticRecommendedParameters,
          'Recommended Programmatic Parameters',
          showDebug,
        )}
        {this.renderTable(
          analysisResult.otherParameters,
          'Other Parameters',
          showDebug,
        )}
      </div>
    );
  }
}
VastURLParameters.propTypes = {
  data: PropTypes.object,
  showDebug: PropTypes.bool,
};

export default VastURLParameters;
