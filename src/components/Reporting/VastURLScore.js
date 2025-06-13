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

import { Box } from '@mui/system';
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
   * @param {Object} parameters
   * @return {Object}
   */
  getParametersScore(parameters) {
    const result = {
      completion: 0,
      invalid: 0,
      missing: 0,
      overridden: 0,
      score: 0,
      sdkManaged: 0,
      total: 0,
      valid: 0,
    };

    // Calculate parameters scores.
    for (const parameter of Object.values(parameters)) {
      if (parameter.missing) {
        result.missing++;
      } else if (parameter.invalid) {
        result.invalid++;
      } else if (parameter.valid) {
        result.valid++;
      }

      if (parameter.override) {
        result.overridden++;
      }
      if (parameter.sdkManaged) {
        result.sdkManaged++;
      }
      if (typeof parameter.score === 'number') {
        result.score += parameter.score;
      }
      result.total++;
    }

    // Calculate completion score.
    result.completion =
      result.total > 0 ? Math.floor((result.valid / result.total) * 100) : 0;

    return result;
  }

  /**
   * @param {*} requiredParametersScore
   * @param {*} requiredProgrammaticParametersScore
   * @param {*} recommendedProgrammaticParametersScore
   * @returns {number}
   */
  getWeightedScore(
    requiredParametersScore,
    requiredProgrammaticParametersScore,
    recommendedProgrammaticParametersScore,
  ) {
    // Calculate the total score based on the weighted scores.
    const REQUIRED_WEIGHT = 0.7;
    const PROGRAMMATIC_REQUIRED_WEIGHT = 0.2;
    const PROGRAMMATIC_RECOMMENDED_WEIGHT = 0.1;

    // Check if required parameters are missing and return 0 if so.
    if (
      requiredParametersScore.total > 0 &&
      requiredParametersScore.valid < requiredParametersScore.total
    ) {
      return 0;
    }

    // Calculate the weighted scores.
    const requiredScore =
      requiredParametersScore.total > 0
        ? requiredParametersScore.valid / requiredParametersScore.total
        : 1;

    const programmaticRequiredScore =
      requiredProgrammaticParametersScore.total > 0
        ? requiredProgrammaticParametersScore.valid /
          requiredProgrammaticParametersScore.total
        : 1;

    const programmaticRecommendedScore =
      recommendedProgrammaticParametersScore.total > 0
        ? recommendedProgrammaticParametersScore.valid /
          recommendedProgrammaticParametersScore.total
        : 1;

    // Calculate the total score based on the weighted scores.
    const totalScore =
      requiredScore * REQUIRED_WEIGHT +
      programmaticRequiredScore * PROGRAMMATIC_REQUIRED_WEIGHT +
      programmaticRecommendedScore * PROGRAMMATIC_RECOMMENDED_WEIGHT;

    return Math.round(totalScore * 100);
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

    // Calculate total score and individual scores.
    const requiredParametersScore = this.getParametersScore(
      analysisResult.requiredParameters,
    );
    const requiredProgrammaticParametersScore = this.getParametersScore(
      analysisResult.programmaticRequiredParameters,
    );
    const recommendedProgrammaticParametersScore = this.getParametersScore(
      analysisResult.programmaticRecommendedParameters,
    );
    const weightedScore = this.getWeightedScore(
      requiredParametersScore,
      requiredProgrammaticParametersScore,
      recommendedProgrammaticParametersScore,
    );

    return (
      <Box>
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
              value={weightedScore}
              color={this.getScoreColor(weightedScore)}
            >
              {weightedScore}%
            </CircularProgress>
            <Typography variant="h5">Weighted Score</Typography>
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
              value={requiredParametersScore.completion}
              color={
                requiredParametersScore.completion < 100 ? 'danger' : 'success'
              }
            >
              {requiredParametersScore.completion}%
            </CircularProgress>
            <Typography variant="h5" style={{ paddingLeft: '30px' }}>
              Required
            </Typography>
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
              value={requiredProgrammaticParametersScore.completion}
              color={this.getProgrammaticRequiredColor(
                requiredProgrammaticParametersScore.completion,
              )}
            >
              {requiredProgrammaticParametersScore.completion}%
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
              value={recommendedProgrammaticParametersScore.completion}
            >
              {recommendedProgrammaticParametersScore.completion}%
            </CircularProgress>
            <Typography variant="h5">Recommended</Typography>
          </Grid>
        </Grid>
        {weightedScore === 0 && requiredParametersScore.total >= 1 && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            The weighted score is 0% because at least one required parameter is
            missing.
          </Typography>
        )}
      </Box>
    );
  }
}

VastURLScore.propTypes = {
  data: PropTypes.object,
};

export default VastURLScore;
