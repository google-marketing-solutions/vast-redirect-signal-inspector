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
 * @fileoverview Utility functions for parameter handling
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import vastAdTagParameters from '../parameter/vastAdTagParameters.json';
import sdkParameters from '../parameter/sdkParameters.json';

import ApiIcon from '@mui/icons-material/Api';
import LockIcon from '@mui/icons-material/Lock';
import RecommendIcon from '@mui/icons-material/Recommend';
import TuneIcon from '@mui/icons-material/Tune';

/**
 * Get icon for section title based on text
 * @param {string} text - The section title text
 * @return {React.ReactNode} The appropriate icon
 */
export const getIconForText = (text) => {
  if (text.startsWith('Required Programmatic')) {
    return <ApiIcon color="warning" />;
  } else if (text.startsWith('Required')) {
    return <LockIcon color="error" />;
  } else if (text.startsWith('Recommended')) {
    return <RecommendIcon color="primary" />;
  } else {
    return <TuneIcon color="action" />;
  }
};

/**
 * @param {string} name
 * @return {string}
 */
export const getVastAdTagParameterDeprecation = (name) => {
  if (!vastAdTagParameters) {
    return '';
  }
  for (const item of vastAdTagParameters) {
    if (item.name === name) {
      return item.deprecated;
    }
  }
  return '';
};

/**
 * @param {string} name
 * @return {string}
 */
export const getVastAdTagParameterDescription = (name) => {
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
 * @param {string} name
 * @return {string}
 */
export const getVastAdTagParameterHelp = (name) => {
  if (!vastAdTagParameters) {
    return '';
  }
  for (const item of vastAdTagParameters) {
    if (item.name === name) {
      return item.help;
    }
  }
  return '';
};

/**
 * @param {string} name
 * @return {string}
 */
export const getSdkHandlingInfo = (name) => {
  if (!sdkParameters) {
    return '';
  }
  for (const item of sdkParameters) {
    if (item.name === name) {
      return item.handling;
    }
  }
  return '';
};

/**
 * @param {string} name
 * @return {string}
 */
export const getVastAdTagParameterWarn = (name) => {
  if (!vastAdTagParameters) {
    return '';
  }
  for (const item of vastAdTagParameters) {
    if (item.name === name) {
      return item.warn;
    }
  }
  return '';
};
