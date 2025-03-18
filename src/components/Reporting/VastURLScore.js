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
import { Grid2 as Grid, Typography } from '@mui/material';
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
    const requiredParametersScore =
      data && data.analysis
        ? Math.floor(
            (data.analysis.parameters.required.valid /
              data.analysis.parameters.required.total) *
              100,
          )
        : 0;
    const requiredProgrammaticParametersScore =
      data && data.analysis
        ? Math.floor(
            (data.analysis.parameters.programmatic.required.valid /
              data.analysis.parameters.programmatic.required.total) *
              100,
          )
        : 0;
    const recommendedProgrammaticParametersScore =
      data && data.analysis
        ? Math.floor(
            (data.analysis.parameters.programmatic.recommended.valid /
              data.analysis.parameters.programmatic.recommended.total) *
              100,
          )
        : 0;
    const totalScore =
      data && data.analysis
        ? data.analysis.parameters.required.score +
          data.analysis.parameters.programmatic.required.score +
          data.analysis.parameters.programmatic.recommended.score
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

export default VastURLScore;
