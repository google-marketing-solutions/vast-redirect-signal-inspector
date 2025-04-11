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
 * @fileoverview VAST URL Score component.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { CircularProgress } from '@mui/joy';

/**
 * @class
 */
class VastURLScore extends React.Component {
  /**
   * @param {*} props
   */
  constructor(props) {
    super(props);
  }

  /**
   * @param {*} score
   * @return {string}
   */
  getScoreColor(score) {
    if (score <= 0) {
      return 'danger';
    } else if (score < 25) {
      return 'warning';
    } else if (score < 50) {
      return 'neutral';
    } else if (score < 75) {
      return 'primary';
    }
    return 'success';
  }

  /**
   * @param {*} score
   * @return {string}
   */
  getProgrammaticRequiredColor(score) {
    if (score <= 0) {
      return 'danger';
    } else if (score < 25) {
      return 'warning';
    } else if (score < 50) {
      return 'neutral';
    } else if (score < 75) {
      return 'primary';
    }
    return 'success';
  }

  /**
   * @return {React.ReactNode}
   */
  render() {
    const { data } = this.props;
    const analysisResult = data || {};
    if (!analysisResult) {
      return null;
    }
    const requiredParametersScore = analysisResult
      ? Math.floor(
          (analysisResult.requiredParameters.valid /
            analysisResult.requiredParameters.total) *
            100,
        )
      : 0;
    const requiredProgrammaticParametersScore = analysisResult
      ? Math.floor(
          (analysisResult.programmaticRequiredParameters.valid /
            analysisResult.programmaticRequiredParameters.total) *
            100,
        )
      : 0;
    const recommendedProgrammaticParametersScore = analysisResult
      ? Math.floor(
          (analysisResult.programmaticRecommendedParameters.valid /
            analysisResult.programmaticRecommendedParameters.total) *
            100,
        )
      : 0;
    const totalScore = analysisResult
      ? analysisResult.requiredParameters.score +
        analysisResult.programmaticRequiredParameters.score +
        analysisResult.programmaticRecommendedParameters.score
      : 0;
    return (
      <Grid
        container
        spacing={5}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid size={3}>
          <CircularProgress
            sx={{
              '--CircularProgress-trackThickness': '20px',
              '--CircularProgress-size': '150px',
              '--CircularProgress-progressThickness': '25px',
            }}
            variant="soft"
            determinate
            value={totalScore}
            color={this.getScoreColor(totalScore)}
          >
            {totalScore} {}
          </CircularProgress>
          <Typography variant="h5">Total Score</Typography>
        </Grid>

        <Grid size={3}>
          <CircularProgress
            sx={{
              '--CircularProgress-trackThickness': '20px',
              '--CircularProgress-size': '150px',
              '--CircularProgress-progressThickness': '25px',
            }}
            variant="soft"
            determinate
            value={requiredParametersScore}
            color={requiredParametersScore < 100 ? 'danger' : 'success'}
          >
            {requiredParametersScore}%
          </CircularProgress>
          <Typography variant="h5">Required</Typography>
        </Grid>

        <Grid size={3}>
          <CircularProgress
            sx={{
              '--CircularProgress-trackThickness': '20px',
              '--CircularProgress-size': '150px',
              '--CircularProgress-progressThickness': '25px',
            }}
            variant="soft"
            determinate
            value={requiredProgrammaticParametersScore}
            color={this.getProgrammaticRequiredColor(
              requiredProgrammaticParametersScore,
            )}
          >
            {requiredProgrammaticParametersScore}%
          </CircularProgress>
          <Typography variant="h5">Programmatic</Typography>
        </Grid>

        <Grid size={3}>
          <CircularProgress
            sx={{
              '--CircularProgress-trackThickness': '20px',
              '--CircularProgress-size': '150px',
              '--CircularProgress-progressThickness': '25px',
            }}
            variant="soft"
            determinate
            value={recommendedProgrammaticParametersScore}
          >
            {recommendedProgrammaticParametersScore}%
          </CircularProgress>
          <Typography variant="h5">Recommended</Typography>
        </Grid>
      </Grid>
    );
  }
}

/**
 * VastURLScore component.
 * @type {Object}
 */
VastURLScore.propTypes = {
  data: PropTypes.shape({
    requiredParameters: PropTypes.shape({
      valid: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      score: PropTypes.number.isRequired,
    }).isRequired,
    programmaticRequiredParameters: PropTypes.shape({
      valid: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      score: PropTypes.number.isRequired,
    }).isRequired,
    programmaticRecommendedParameters: PropTypes.shape({
      valid: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      score: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default VastURLScore;
