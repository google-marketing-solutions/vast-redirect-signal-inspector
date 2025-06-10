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
 * @fileoverview Share Button Component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import Tooltip from '@mui/material/Tooltip';

import { encodeState } from '../../utils/encoder';

class ShareButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleShareClick = this.handleShareClick.bind(this);
  }

  handleShareClick() {
    const { state, onShare } = this.props;
    const encoded = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      if (onShare) {
        onShare();
      } else {
        alert('URL copied to clipboard!');
      }
    });
  }

  render() {
    return (
      <Tooltip title="Share analysis state">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ShareIcon />}
          className="share-button"
          onClick={this.handleShareClick}
          sx={{ margin: 5 }}
          disabled={this.props.disabled}
        >
          Share Analysis
        </Button>
      </Tooltip>
    );
  }
}

ShareButton.propTypes = {
  state: PropTypes.object.isRequired,
  onShare: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ShareButton;
