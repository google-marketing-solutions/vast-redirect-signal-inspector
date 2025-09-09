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
 * @fileoverview VAST Response Display Component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled('div')(({ theme }) => ({
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

/**
 * Component for rendering VAST Response
 * @class
 */
class VastResponse extends React.PureComponent {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
  }

  /**
   * @return {React.ReactNode}
   * @override
   */
  render() {
    const { vastResponse } = this.props;

    if (!vastResponse) return null;

    return (
      <div
        id="vast-response"
        style={{ marginBottom: '20px', scrollMarginTop: '100px' }}
        className="vast-url-parameters vast-url-parameters-vast-response"
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              fontSize: '1rem',
              scrollMarginTop: '80px',
            },
            [theme.breakpoints.up('sm')]: {
              scrollMarginTop: '100px',
            },
            position: 'relative',
            zIndex: 1,
          })}
        >
          VAST Response
        </Typography>
        <StyledTableContainer component={Paper}>
          <div style={{ padding: '16px', overflowX: 'auto' }}>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {typeof vastResponse === 'object'
                ? JSON.stringify(vastResponse, null, 2)
                : vastResponse}
            </pre>
          </div>
        </StyledTableContainer>
      </div>
    );
  }
}

VastResponse.propTypes = {
  vastResponse: PropTypes.any,
};

VastResponse.defaultProps = {
  vastResponse: null,
};

export default VastResponse;
