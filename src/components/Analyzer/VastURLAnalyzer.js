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
import sdkParameters from '../../parameter/sdkParameters.json';
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

    // Add SDK specific parameters, if applicable.
    const sdkManagedParamNames =
      this.vastTagType == TAG_TYPE.IMA_SDK
        ? sdkParameters.map((param) => param.name)
        : [];

    // Add IMA SDK specific parameters and remove some parameters
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
    }

    // Add PAI specific parameters
    if (
      this.vastTagType == TAG_TYPE.PAI ||
      this.vastTagType == TAG_TYPE.PAI_PAL
    ) {
      if (!requiredParametersRules.includes('ssss')) {
        requiredParametersRules.push('ssss');
      }
      if (!requiredParametersRules.includes('ip')) {
        requiredParametersRules.push('ip');
      }
    }

    // Add PAL specific parameters
    if (
      this.vastTagType == TAG_TYPE.PAL ||
      this.vastTagType == TAG_TYPE.PAI_PAL
    ) {
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
      sdkManagedParamNames,
    );
    const programmaticRequiredParamsResult = this.validateRequiredParameters(
      this.vastParams,
      programmaticRequiredParamsRules.filter(
        (param) => !requiredParametersRules.includes(param),
      ),
      overrideParams,
      sdkManagedParamNames,
    );
    const programmaticRecommendedParamsResult = this.validateOptionalParameters(
      this.vastParams,
      programmaticRecommendedParamsRules.filter(
        (param) =>
          !requiredParametersRules.includes(param) &&
          !programmaticRequiredParamsRules.includes(param),
      ),
      overrideParams,
      sdkManagedParamNames,
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
      sdkManagedParamNames,
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
   * @param {Array} sdkManagedParamNames
   * @return {Object}
   */
  validateRequiredParameters(
    parameters,
    requiredParams,
    overrideParams = [],
    sdkManagedParamNames = [],
  ) {
    return this.validateParameters(
      parameters,
      requiredParams,
      false,
      overrideParams,
      sdkManagedParamNames,
    );
  }

  /**
   * @param {*} parameters
   * @param {*} optionalParams
   * @param {Array} overrideParams
   * @param {Array} sdkManagedParamNames
   * @return {Object}
   */
  validateOptionalParameters(
    parameters,
    optionalParams,
    overrideParams = [],
    sdkManagedParamNames = [],
  ) {
    return this.validateParameters(
      parameters,
      optionalParams,
      true,
      overrideParams,
      sdkManagedParamNames,
    );
  }

  /**
   * @param {*} parameters
   * @param {*} requiredParams
   * @param {boolean} optionalParameter
   * @param {Array} overrideParams
   * @param {Array} sdkManagedParamNames
   * @return {Object}
   */
  validateParameters(
    parameters,
    requiredParams,
    optionalParameter = false,
    overrideParams = [],
    sdkManagedParamNames = [],
  ) {
    // Results
    const parameterResults = {};

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

      // Check if the parameter is an override or SDK managed parameter.
      const isOverrideParam =
        Array.isArray(overrideParams) &&
        overrideParams.includes(vastAdTagParameterName);
      const isSdkManagedParam =
        Array.isArray(sdkManagedParamNames) &&
        sdkManagedParamNames.includes(vastAdTagParameterName);

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
      parameterResults[vastAdTagParameterName] = parameterResult;

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
      } else if (vastAdTagParameterValidation) {
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
      }

      // Adjust score for overridden and SDK managed parameters.
      if (isOverrideParam || isSdkManagedParam) {
        parameterResult.override = isOverrideParam;
        parameterResult.sdkManaged = isSdkManagedParam;
        parameterResult.score = 2.5;
        if (!parameterResult.valid) {
          parameterResult.valid = true;
        }
      }
    });

    return parameterResults;
  }
}

export default VastURLAnalyzer;
