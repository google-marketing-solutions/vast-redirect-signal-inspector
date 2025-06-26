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
 * @fileoverview Notification manager component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

/**
 * Manages various notifications including errors, warnings, and success messages
 * @return {JSX.Element} The NotificationManager component
 */
const NotificationManager = ({
  error,
  errorMessage,
  onErrorClose,
  warning,
  warningMessage,
  onWarningClose,
  showShareSuccess,
  onShareClose,
}) => {
  return (
    <>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={10000}
          onClose={onErrorClose}
          sx={{ width: '100%' }}
        >
          <Alert severity="error" onClose={onErrorClose}>
            {errorMessage ||
              (typeof error === 'string' ? error : 'An error occurred')}
          </Alert>
        </Snackbar>
      )}
      {warning && (
        <Snackbar
          open={true}
          autoHideDuration={10000}
          onClose={onWarningClose}
          sx={{ width: '100%' }}
        >
          <Alert severity="warning" onClose={onWarningClose}>
            {warningMessage ||
              (typeof warning === 'string' ? warning : 'A warning occurred')}
          </Alert>
        </Snackbar>
      )}
      {showShareSuccess && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={onShareClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={onShareClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Shareable URL copied to clipboard!
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

NotificationManager.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  errorMessage: PropTypes.string,
  onErrorClose: PropTypes.func.isRequired,
  warning: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  warningMessage: PropTypes.string,
  onWarningClose: PropTypes.func.isRequired,
  showShareSuccess: PropTypes.bool,
  onShareClose: PropTypes.func.isRequired,
};

NotificationManager.defaultProps = {
  error: null,
  errorMessage: '',
  warning: null,
  warningMessage: '',
  showShareSuccess: false,
};

export default NotificationManager;
