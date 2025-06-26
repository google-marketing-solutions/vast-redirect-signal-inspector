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
 * @fileoverview URL input form component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InsightsIcon from '@mui/icons-material/Insights';

/**
 * URL input form with analyze button
 * @return {JSX.Element} The URLInputForm component
 */
const URLInputForm = ({ url, onChange, onAnalyze, isAnalyzeDisabled }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mb: 2,
      }}
    >
      <TextField
        className="vast-redirect-url-input"
        label="Vast Redirect URL"
        value={url}
        variant="outlined"
        fullWidth
        sx={{ mr: 2 }}
        onChange={onChange}
      />
      <Button
        className="analyze-button"
        variant="contained"
        color="primary"
        size="large"
        startIcon={<InsightsIcon />}
        onClick={onAnalyze}
        disabled={isAnalyzeDisabled}
      >
        Analyze
      </Button>
    </Box>
  );
};

URLInputForm.propTypes = {
  url: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onAnalyze: PropTypes.func.isRequired,
  isAnalyzeDisabled: PropTypes.bool,
};

URLInputForm.defaultProps = {
  isAnalyzeDisabled: false,
};

export default URLInputForm;
