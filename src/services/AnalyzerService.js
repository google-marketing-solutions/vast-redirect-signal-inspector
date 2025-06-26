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
 * @fileoverview URL analyzer service for the VAST Redirect Signal Inspector.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import VastURLValidator from '../components/Validator/VastURLValidator';
import VastURLParser from '../components/Parser/VastURLParser';
import VastURLAnalyzer from '../components/Analyzer/VastURLAnalyzer';

/**
 * @param {string} url - The URL to validate
 * @return {Object} Validation result
 */
export const validateUrl = (url) => {
  const validator = new VastURLValidator(url);
  return validator.validate();
};

/**
 * @param {string} url - The URL to analyze
 * @param {string} tagType - The selected tag type
 * @param {string} implementationType - The selected implementation type
 * @return {Promise<Object>} Analysis result
 */
export const analyzeUrl = async (url, tagType, implementationType) => {
  const result = {
    success: false,
    error: null,
    vastParameters: {},
    analysisResult: {},
  };

  // Parse URL and extract parameters
  const parser = new VastURLParser(url);
  const parseResult = parser.parse();
  if (!parseResult.success) {
    result.error = parseResult.error;
    return result;
  }
  result.vastParameters = parseResult.params;

  // Analyze Vast URL based on the parsed parameters
  const analyzer = new VastURLAnalyzer(
    url,
    parseResult.params,
    tagType,
    implementationType,
  );

  const analyzerResult = analyzer.analyze();
  if (!analyzerResult.success) {
    result.error = analyzerResult.error;
    return result;
  }

  result.analysisResult = analyzerResult.analysisResult;
  result.success = true;
  return result;
};

export const handleNavigation = (key) => {
  switch (key) {
    case 'Home':
      window.location.href = '/vast-redirect-signal-inspector/';
      break;
    case 'Source':
      window.open(
        'https://github.com/google-marketing-solutions/vast-redirect-signal-inspector',
      );
      break;
    case 'Issues':
      window.open(
        'https://github.com/google-marketing-solutions/vast-redirect-signal-inspector/issues',
      );
      break;
    case 'Help':
      window.open('https://support.google.com/admanager/answer/10678356');
      break;
    default:
      break;
  }
};
