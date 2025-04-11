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
 * @fileoverview VAST URL Analyzer for different implementation types.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { IMPLEMENTATION_TYPE, TAG_TYPE } from '../../constants';

import audioValidationRules from '../../rules/audioValidationRules.json';
import connectTVValidationRules from '../../rules/connectedTVValidationRules.json';
import digitalOutOfHomeValidationRules from '../../rules/digitalOutOfHomeValidationRules.json';
import mobileValidationRules from '../../rules/mobileAppValidationRules.json';
import palNonceParameters from '../../parameter/palNonceParameters.json';
import vastAdTagParameters from '../../parameter/vastAdTagParameters.json';
import webValidationRules from '../../rules/webValidationRules.json';

import VastTagAnalyzerResult from './VastTagAnalyzerResult';
import VastTagParameterResult from './VastTagParameterResult';

/**
 * @class
 */
class VastURLAnalyzer {
  static ErrorCode = {
    PARAMETERS_EMPTY: 'Parameters are empty.',
  };

  static DefaultScore = {
    OPTIONAL_PARAM: 0.5,
    OPTIONAL_PARAM_MISSING: 0,
    OPTIONAL_PARAM_VALIDATED: 1,
    REQUIRED_PARAM: 4,
    REQUIRED_PARAM_MISSING: -5,
    REQUIRED_PARAM_VALIDATED: 5,
  };

  /**
   * @param {Object} vastParams
   * @param {TAG_TYPE} vastTagType
   * @param {IMPLEMENTATION_TYPE} implementationType
   * @constructor
   */
  constructor(vastURL, vastParams, vastTagType, implementationType) {
    this.vastURL = vastURL;
    this.vastParams = vastParams;
    this.vastTagType = vastTagType;
    this.implementationType = implementationType;
    this.state = {
      analysisResult: null,
      metadata: null,
      vastAdTagParameters: null,
      webValidationRules: null,
    };
  }

  /**
   * @return {VastTagAnalyzerResult}
   */
  analyze() {
    if (!this.vastParams || Object.keys(this.vastParams).length === 0) {
      return {
        success: false,
        error: VastURLAnalyzer.ErrorCode.PARAMETERS_EMPTY,
      };
    }

    console.info(
      'Analyzing',
      this.vastTagType,
      'VAST URL ',
      this.vastURL,
      'for',
      this.implementationType,
      'with',
      this.vastParams,
    );

    // Loading rules based on the implementation type and create a immutable copy.
    let rules = {};
    if (this.implementationType == IMPLEMENTATION_TYPE.WEB) {
      rules = JSON.parse(JSON.stringify(webValidationRules));
    } else if (this.implementationType == IMPLEMENTATION_TYPE.MOBILE_APP) {
      rules = JSON.parse(JSON.stringify(mobileValidationRules));
    } else if (this.implementationType == IMPLEMENTATION_TYPE.CONNECTED_TV) {
      rules = JSON.parse(JSON.stringify(connectTVValidationRules));
    } else if (this.implementationType == IMPLEMENTATION_TYPE.AUDIO) {
      rules = JSON.parse(JSON.stringify(audioValidationRules));
    } else if (
      this.implementationType == IMPLEMENTATION_TYPE.DIGITAL_OUT_OF_HOME
    ) {
      rules = JSON.parse(JSON.stringify(digitalOutOfHomeValidationRules));
    }

    // Define basic Rules
    const requiredParametersRules = rules.parameters.required;
    const programmaticRequiredParamsRules =
      rules.parameters.programmatic.required;
    const programmaticRecommendedParamsRules =
      rules.parameters.programmatic.recommended;
    const overrideParams = [];

    // Adding additional requirements based on the tag type
    if (this.vastTagType == TAG_TYPE.IMA_SDK) {
      if (programmaticRecommendedParamsRules.includes('dth')) {
        programmaticRecommendedParamsRules.splice(
          programmaticRecommendedParamsRules.indexOf('dth'),
          1,
        );
      }
      if (programmaticRecommendedParamsRules.includes('givn')) {
        programmaticRecommendedParamsRules.splice(
          programmaticRecommendedParamsRules.indexOf('givn'),
          1,
        );
      }
    } else if (this.vastTagType == TAG_TYPE.PAI) {
      if (!requiredParametersRules.includes('ssss')) {
        requiredParametersRules.push('ssss');
      }
      if (!requiredParametersRules.includes('ip')) {
        requiredParametersRules.push('ip');
      }
    } else if (this.vastTagType == TAG_TYPE.PAL) {
      if (!requiredParametersRules.includes('givn')) {
        requiredParametersRules.push('givn');
      }
      palNonceParameters.forEach((palParam) =>
        overrideParams.push(palParam.override),
      );
    } else if (this.vastTagType == TAG_TYPE.PAL_LEGACY) {
      if (!requiredParametersRules.includes('paln')) {
        requiredParametersRules.push('paln');
      }
      palNonceParameters.forEach((palParam) =>
        overrideParams.push(palParam.override),
      );
    }

    // Special case for specific parameters
    if (
      programmaticRequiredParamsRules.includes('ott_placement') &&
      (this.vastParams['vpos'] === 'preroll' ||
        this.vastParams['vpos'] === 'midroll' ||
        this.vastParams['vpos'] === 'postroll')
    ) {
      programmaticRequiredParamsRules.splice(
        programmaticRequiredParamsRules.indexOf('ott_placement'),
        1,
      );
      programmaticRecommendedParamsRules.push('ott_placement');
    }

    // Create Results
    const requiredParamsResult = this.validateRequiredParameters(
      this.vastParams,
      requiredParametersRules,
      overrideParams,
    );
    const programmaticRequiredParamsResult = this.validateRequiredParameters(
      this.vastParams,
      programmaticRequiredParamsRules.filter(
        (param) => !requiredParametersRules.includes(param),
      ),
      overrideParams,
    );
    const programmaticRecommendedParamsResult = this.validateOptionalParameters(
      this.vastParams,
      programmaticRecommendedParamsRules.filter(
        (param) =>
          !requiredParametersRules.includes(param) &&
          !programmaticRequiredParamsRules.includes(param),
      ),
      overrideParams,
    );
    const otherParamsResult = this.validateOptionalParameters(
      this.vastParams,
      Object.keys(this.vastParams).filter(
        (param) =>
          !requiredParametersRules.includes(param) &&
          !programmaticRequiredParamsRules.includes(param) &&
          !programmaticRecommendedParamsRules.includes(param),
      ),
      overrideParams,
    );
    const specialParamsResult = {};

    const analysisResult = new VastTagAnalyzerResult(this.vastURL);
    analysisResult.requiredParameters = requiredParamsResult;
    analysisResult.programmaticRequiredParameters =
      programmaticRequiredParamsResult;
    analysisResult.programmaticRecommendedParameters =
      programmaticRecommendedParamsResult;
    analysisResult.otherParameters = otherParamsResult;
    analysisResult.specialParameters = specialParamsResult;
    console.log('Analysis Result', analysisResult);
    return { success: true, analysisResult };
  }

  /**
   * @param {*} parameters
   * @param {*} requiredParams
   * @param {Array} overrideParams
   * @return {Object}
   */
  validateRequiredParameters(parameters, requiredParams, overrideParams = []) {
    return this.validateParameters(
      parameters,
      requiredParams,
      false,
      overrideParams,
    );
  }

  /**
   * @param {*} parameters
   * @param {*} optionalParams
   * @param {Array} overrideParams
   * @return {Object}
   */
  validateOptionalParameters(parameters, optionalParams, overrideParams = []) {
    return this.validateParameters(
      parameters,
      optionalParams,
      true,
      overrideParams,
    );
  }

  /**
   * @param {*} parameters
   * @param {*} requiredParams
   * @param {boolean} optionalParameter
   * @param {Array} overrideParams
   * @return {Object}
   */
  validateParameters(
    parameters,
    requiredParams,
    optionalParameter = false,
    overrideParams = [],
  ) {
    // Results
    const parameterResults = {
      params: {},
      score: 0,
      missing: 0,
      invalid: 0,
      overridden: 0,
      valid: 0,
      total: requiredParams.length,
    };

    // Validate required parameters
    requiredParams.forEach((parameterName) => {
      // Get vast ad tag parameter reference.
      const vastAdTagParameter = vastAdTagParameters.find(
        (entry) => entry.name === parameterName,
      );
      const vastAdTagParameterValidation = vastAdTagParameter
        ? vastAdTagParameter.validation
        : null;
      const vastAdTagParameterName = vastAdTagParameter
        ? vastAdTagParameter.name
        : parameterName;
      const isOverrideParam =
        Array.isArray(overrideParams) &&
        overrideParams.includes(vastAdTagParameterName);

      // Check all parameters if we have a match and check alias if not.
      let parameterValue = parameters[parameterName];
      let aliasName = '';
      if (!parameterValue && vastAdTagParameter && vastAdTagParameter.aliases) {
        for (const alias of vastAdTagParameter.aliases) {
          if (parameters[alias]) {
            parameterValue = parameters[alias];
            aliasName = alias;
            console.info(
              'Found alias',
              aliasName,
              'for parameter',
              vastAdTagParameterName,
              'with value',
              parameterValue,
            );
            break;
          }
        }
      }

      // Define parameter result with alias support.
      const parameterResult = new VastTagParameterResult(
        vastAdTagParameterName,
        parameterValue,
      );
      if (aliasName) {
        parameterResult.alias = aliasName;
      }
      parameterResults.params[vastAdTagParameterName] = parameterResult;

      // Perform validation based on the parameter type and rules.
      if (
        !(vastAdTagParameterName in parameters) &&
        (!aliasName || !(aliasName in parameters))
      ) {
        console.error('Missing parameter', vastAdTagParameterName);
        parameterResult.score = optionalParameter
          ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM_MISSING
          : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM_MISSING;
        parameterResult.exists = false;
        parameterResult.valid = false;
        parameterResults.missing++;
      } else {
        if (vastAdTagParameterValidation) {
          const validation = new RegExp(vastAdTagParameterValidation);
          if (!validation.test(parameterValue)) {
            console.warn(
              'Invalid parameter value',
              vastAdTagParameterName,
              parameterValue,
            );
            parameterResult.score = optionalParameter
              ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM_MISSING
              : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM_MISSING;
            parameterResult.exists = true;
            parameterResult.valid = false;
            parameterResults.invalid++;
          } else {
            console.info(
              'Validated parameter',
              vastAdTagParameterName,
              ':',
              parameterValue,
            );
            parameterResult.score = optionalParameter
              ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM_VALIDATED
              : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM_VALIDATED;
            parameterResult.exists = true;
            parameterResult.valid = true;
            parameterResults.valid++;
          }
        } else {
          console.warn(
            'Missing validation for parameter',
            vastAdTagParameterName,
          );
          parameterResult.score = optionalParameter
            ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM
            : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM;
          parameterResult.exists = true;
          parameterResult.valid = true;
          parameterResults.valid++;
        }
      }

      // Calculate Score
      if (isOverrideParam) {
        parameterResult.override = true;
        parameterResult.score = 2.5;
        parameterResults.overridden++;
      }
      parameterResults.score += parameterResult.score;
    });
    return parameterResults;
  }
}

export default VastURLAnalyzer;
