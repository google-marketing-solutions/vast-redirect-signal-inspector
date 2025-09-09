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
 * @fileoverview Parameter Table Component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  getIconForText,
  getVastAdTagParameterDeprecation,
  getVastAdTagParameterDescription,
  getVastAdTagParameterHelp,
  getSdkHandlingInfo,
  getVastAdTagParameterWarn,
} from '../../utils/parameterUtils';

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
 * Component for rendering parameter tables
 * @class
 */
class ParameterTable extends React.PureComponent {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
  }

  /**
   * Helper function to format PPSJ values
   * @param {*} ppsjValue
   * @return {React.ReactNode}
   */
  formatPpsjValue = (ppsjValue) => {
    if (typeof ppsjValue === 'string') {
      return (
        <Typography variant="body2" component="span">
          {ppsjValue}
        </Typography>
      );
    }

    try {
      const formattedJson = JSON.stringify(ppsjValue, null, 2);
      return (
        <SyntaxHighlighter
          language="javascript"
          style={oneLight}
          customStyle={{
            margin: 0,
            fontSize: '12px',
            lineHeight: '1.4',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e1e4e8',
            borderRadius: '4px',
            maxHeight: '300px',
          }}
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {formattedJson}
        </SyntaxHighlighter>
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
   * @return {React.ReactNode}
   * @override
   */
  render() {
    const { params, title, showDebug = false } = this.props;

    if (!params) return null;

    // Create an ID from the title for navigation scrolling
    const sectionId = title.toLowerCase().replace(/\s+/g, '-');

    return (
      <div
        id={sectionId}
        style={{
          marginBottom: '20px',
          scrollMarginTop: '100px',
          position: 'relative',
        }}
        className={`vast-url-parameters vast-url-parameters-${title
          .toLowerCase()
          .replace(/\s/g, '-')}`}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            marginBottom: 1,
          }}
        >
          {getIconForText(title)}
          <Typography
            variant="h6"
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                fontSize: '1rem',
              },
            })}
          >
            {title}
          </Typography>
        </Box>

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
                  <StyledTableCell sx={{ width: '15px' }}>Help</StyledTableCell>
                  <StyledTableCell className="value-cell">
                    Value
                  </StyledTableCell>
                  {showDebug && (
                    <>
                      <StyledTableCell sx={{ width: '10%' }}>
                        Score
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: '10%' }}>
                        SDK Info
                      </StyledTableCell>
                    </>
                  )}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {Object.entries(params).map(([, param]) => (
                  <StyledTableRow
                    key={param.name}
                    style={{ position: 'relative' }}
                  >
                    <StyledTableCell sx={{ width: '50px' }}>
                      {param.exists ? (
                        param.valid ? (
                          getVastAdTagParameterDeprecation(param.name) ? (
                            <Tooltip
                              title={
                                'Deprecated: ' +
                                getVastAdTagParameterDeprecation(param.name)
                              }
                            >
                              <CheckCircleOutlineIcon
                                style={{ color: 'orange' }}
                              />
                            </Tooltip>
                          ) : param.accepted ? (
                            <Tooltip
                              title={getVastAdTagParameterWarn(param.name)}
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
                        title={getVastAdTagParameterDescription(param.name)}
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
                      {getVastAdTagParameterHelp(param.name) && (
                        <a
                          href={getVastAdTagParameterHelp(param.name)}
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
                        ) : (
                          <SyntaxHighlighter
                            language="javascript"
                            style={oneLight}
                            customStyle={{
                              margin: 0,
                              fontSize: '12px',
                              lineHeight: '1.4',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e1e4e8',
                              borderRadius: '4px',
                              maxHeight: '300px',
                            }}
                            showLineNumbers={false}
                            wrapLines={true}
                            wrapLongLines={true}
                          >
                            {JSON.stringify(param.value, null, 2)}
                          </SyntaxHighlighter>
                        )
                      ) : (
                        <Typography variant="body2" component="span">
                          {String(param.value || '')}
                        </Typography>
                      )}
                    </StyledTableCell>

                    {showDebug && (
                      <>
                        <StyledTableCell>
                          {param.score !== undefined ? param.score : 'N/A'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {getSdkHandlingInfo(param.name) || 'N/A'}
                        </StyledTableCell>
                      </>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </div>
      </div>
    );
  }
}

ParameterTable.propTypes = {
  params: PropTypes.object,
  title: PropTypes.string.isRequired,
  showDebug: PropTypes.bool,
};

ParameterTable.defaultProps = {
  params: null,
  showDebug: false,
};

export default ParameterTable;
