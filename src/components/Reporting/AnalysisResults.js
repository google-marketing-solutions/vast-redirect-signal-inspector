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
 * @fileoverview Analysis results component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import VastURLScore from './VastURLScore';
import VastURLParameters from './VastURLParameters';
import ShareButton from '../Button/ShareButton';
import * as styles from './style.module.css';

/**
 * @return {JSX.Element|null} The AnalysisResults component or null if no results
 */
const AnalysisResults = ({
  analysisResult,
  vastRedirectURL,
  vastTagType,
  implementationType,
  showDebug,
  onShareClick,
  onRefreshVast,
}) => {
  if (!analysisResult || Object.keys(analysisResult).length === 0) {
    return null;
  }

  return (
    <Box className={styles.resultsContainer}>
      <Box className={styles.headerContainer}>
        <ShareButton
          state={{
            vastRedirectURL,
            vastTagType,
            implementationType,
          }}
          onShare={onShareClick}
          disabled={vastRedirectURL !== analysisResult.url}
          size="small"
        />
      </Box>

      <Box
        id="vast-url-score-result"
        className={`vast-url-score-result ${styles.scoreContainer}`}
      >
        <Box minHeight={120}>
          <VastURLScore data={analysisResult} />
        </Box>
      </Box>

      <VastURLParameters
        data={analysisResult}
        showDebug={showDebug}
        onRefreshVast={onRefreshVast}
      />
    </Box>
  );
};

AnalysisResults.propTypes = {
  analysisResult: PropTypes.object,
  vastRedirectURL: PropTypes.string.isRequired,
  vastTagType: PropTypes.string.isRequired,
  implementationType: PropTypes.string.isRequired,
  showDebug: PropTypes.bool,
  onShareClick: PropTypes.func.isRequired,
  onRefreshVast: PropTypes.func,
};

AnalysisResults.defaultProps = {
  analysisResult: null,
  showDebug: false,
};

export default AnalysisResults;
