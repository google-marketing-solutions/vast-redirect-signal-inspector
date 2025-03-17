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
import {
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  styled,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import vastAdTagParameters from '../../parameter/vastAdTagParameters.json';

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
   * @param {*} params
   * @param {string} title
   * @return {React.ReactNode}
   */
  renderTable = (params, title) => {
    if (!params) return null;

    return (
      <div style={{ marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell sx={{ width: '50px' }}>Status</StyledTableCell>
                <StyledTableCell>Parameter</StyledTableCell>
                <StyledTableCell>Value</StyledTableCell>
                <StyledTableCell>Score</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {Object.values(params.params).map((param) => (
                <StyledTableRow key={param.name}>
                  <StyledTableCell sx={{ width: '50px' }}>
                    {param.exists ? (
                      param.valid ? (
                        <Tooltip title="Valid">
                          <CheckCircleOutlineIcon style={{ color: 'green' }} />
                        </Tooltip>
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
                      {param.name}
                    </Tooltip>
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
                        </Typography> // Leeres Object
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
    return (
      <div>
        {this.renderTable(
          data.analysis.parameters.required,
          'Required Parameters',
        )}
        {this.renderTable(
          data.analysis.parameters.programmatic.required,
          'Required Programmatic Parameters',
        )}
        {this.renderTable(
          data.analysis.parameters.programmatic.recommended,
          'Programmatic Recommended Parameters',
        )}
        {this.renderTable(data.analysis.parameters.other, 'Other Parameters')}
      </div>
    );
  }
}

export default VastURLParameters;
