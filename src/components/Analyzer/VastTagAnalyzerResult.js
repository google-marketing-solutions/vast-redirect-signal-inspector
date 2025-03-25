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
 * @fileoverview VAST Tag Analyzer Result.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @class
 */
class VastTagAnalyzerResult {
  /**
   * @param {string} url
   */
  constructor(url = '') {
    this._url = url;
    this._date = new Date();
    this._parameters = {
      required: {},
      optional: {},
      programmatic: {
        required: {},
        recommended: {},
      },
      other: {},
      special: {},
    };
  }

  /**
   * @return {string}
   */
  get url() {
    return this._url;
  }

  /**
   * @return {Date}
   */
  get date() {
    return this._date;
  }

  /**
   * @return {Object}
   */
  get parameters() {
    return this._parameters;
  }

  /**
   * @return {Object}
   */
  get requiredParameters() {
    return this._parameters.required;
  }

  /**
   * @return {Object}
   */
  get optionalParameters() {
    return this._parameters.optional;
  }

  /**
   * @return {Object}
   */
  get programmaticRequiredParameters() {
    return this._parameters.programmatic.required;
  }

  /**
   * @return {Object}
   */
  get programmaticRecommendedParameters() {
    return this._parameters.programmatic.recommended;
  }

  /**
   * @return {Object}
   */
  get otherParameters() {
    return this._parameters.other;
  }

  /**
   * @param {Object} parameters
   */
  set requiredParameters(parameters) {
    this._parameters.required = parameters;
  }

  /**
   * @param {Object} parameters
   */
  set optionalParameters(parameters) {
    this._parameters.optional = parameters;
  }

  /**
   * @param {Object} parameters
   */
  set programmaticRequiredParameters(parameters) {
    this._parameters.programmatic.required = parameters;
  }

  /**
   * @param {Object} parameters
   */
  set programmaticRecommendedParameters(parameters) {
    this._parameters.programmatic.recommended = parameters;
  }

  /**
   * @param {Object} parameters
   */
  set otherParameters(parameters) {
    this._parameters.other = parameters;
  }

  /**
   * @param {Object} parameters
   */
  set specialParameters(parameters) {
    this._parameters.special = parameters;
  }
}

export default VastTagAnalyzerResult;
