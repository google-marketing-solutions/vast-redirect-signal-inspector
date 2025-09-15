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
 * @fileoverview Implementation type selector component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tooltip from '@mui/material/Tooltip';

import * as styles from './style.module.css';

/**
 * @param {string} implementationType - The implementation type
 * @return {string} Tooltip text
 */
const getImplementationTypeTooltip = (implementationType) => {
  const tooltips = {
    web: 'Desktop and mobile web browsers - Standard web implementation',
    mobileApp:
      'Native mobile applications (iOS/Android) - Mobile app integration',
    connectedTV: 'Smart TVs and streaming devices - Large screen experiences',
    audio: 'Audio-only environments - Podcasts and audio streaming platforms',
    digitalOutOfHome:
      'DOOH displays and digital billboards - Public advertising screens',
  };
  return tooltips[implementationType] || implementationType;
};

/**
 * @return {JSX.Element} The ImplementationTypeSelector component
 */
const ImplementationTypeSelector = ({
  selectedType,
  implementationTypes,
  onChange,
}) => {
  return (
    <FormControl
      component="fieldset"
      className={styles.fieldsetBorderNoBottomMargin}
    >
      <FormLabel component="legend" className={styles.fieldsetLabel}>
        Implementation Type
      </FormLabel>

      <Box className={styles.formContentBox}>
        <RadioGroup
          aria-label="implementation-type"
          className={`implementation-type-radio-group ${styles.radioGroupContainer}`}
          name="implementationType"
          value={selectedType}
          onChange={onChange}
          row
        >
          {Object.values(implementationTypes).map((type) => (
            <Tooltip
              key={type}
              title={getImplementationTypeTooltip(type)}
              arrow
              placement="top"
            >
              <FormControlLabel
                value={type}
                control={<Radio />}
                label={type
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              />
            </Tooltip>
          ))}
        </RadioGroup>
      </Box>
    </FormControl>
  );
};

ImplementationTypeSelector.propTypes = {
  selectedType: PropTypes.string.isRequired,
  implementationTypes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ImplementationTypeSelector;
