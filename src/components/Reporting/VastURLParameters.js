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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
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
}));
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  fontWeight: 'bold',
  '& .MuiTableCell-root': {
    color: theme.palette.common.white,
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

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
    return 'This parameter is typically managed by an SDK.';
  };

  /**
   * @param {*} params
   * @param {string} title
   * @return {React.ReactNode}
   */
  renderTable = (params, title) => {
    if (!params) return null;

    return (
      <div
        style={{ marginBottom: '20px' }}
        className={`vast-url-parameters vast-url-parameters-${title.toLowerCase().replace(/\s/g, '-')}`}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell sx={{ width: '25px' }}>Status</StyledTableCell>
                <StyledTableCell sx={{ width: '50px' }}>
                  Parameter
                </StyledTableCell>
                <StyledTableCell sx={{ width: '15px' }}></StyledTableCell>
                <StyledTableCell>Value</StyledTableCell>
                <StyledTableCell sx={{ width: '50px' }}>Score</StyledTableCell>
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
                              this.getVastAdTagParameterDeprecation(param.name)
                            }
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
                      title={this.getVastAdTagParameterDescription(param.name)}
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
                  <StyledTableCell>
                    {param.value && typeof param.value === 'object' ? (
                      Object.keys(param.value).length > 0 ? (
                        <List dense>
                          {Object.entries(param.value).map(([key, value]) => (
                            <ListItem key={key} disablePadding>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    component="span"
                                    fontWeight="bold"
                                  >
                                    {key}:
                                  </Typography>
                                }
                                secondary={
                                  typeof value === 'object' ? (
                                    <Typography
                                      variant="body2"
                                      component="span"
                                    >
                                      {JSON.stringify(value)}
                                    </Typography>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      component="span"
                                    >
                                      {value}
                                    </Typography>
                                  )
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" component="span">
                          {}
                        </Typography>
                      )
                    ) : (
                      <Typography variant="body2" component="span">
                        {param.value !== undefined && param.value !== null
                          ? param.value
                          : 'N/A'}
                      </Typography>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{param.score}</StyledTableCell>
                  <StyledTableCell
                    className={styles.vastUrlParametersOverlay}
                    colSpan={5}
                  >
                    {param.override && (
                      <div className={styles.vastUrlParametersOverrideOverlay}>
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
    );
  };

  /**
   * @return {React.ReactNode}
   * @override
   */
  render() {
    const { data } = this.props;
    const analysisResult = data || {};
    return (
      <div>
        {this.renderTable(
          analysisResult.requiredParameters,
          'Required Parameters',
        )}
        {this.renderTable(
          analysisResult.programmaticRequiredParameters,
          'Required Programmatic Parameters',
        )}
        {this.renderTable(
          analysisResult.programmaticRecommendedParameters,
          'Recommended Programmatic Parameters',
        )}
        {this.renderTable(analysisResult.otherParameters, 'Other Parameters')}
      </div>
    );
  }
}
VastURLParameters.propTypes = {
  data: PropTypes.object,
};

export default VastURLParameters;
