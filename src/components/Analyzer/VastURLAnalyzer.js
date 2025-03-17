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

import vastAdTagParameters from '../../parameter/vastAdTagParameters.json';
import audioValidationRules from '../../rules/audioValidationRules.json';
import connectTVValidationRules from '../../rules/connectedTVValidationRules.json';
import digitalOutOfHomeValidationRules from '../../rules/digitalOutOfHomeValidationRules.json';
import mobileValidationRules from '../../rules/mobileAppValidationRules.json';
import webValidationRules from '../../rules/webValidationRules.json';

import { IMPLEMENTATION_TYPE, TAG_TYPE } from '../../constants';

class VastURLAnalyzer {
  static ErrorCode = {
    PARAMETERS_EMPTY: 'Parameters are empty.',
  };

  static tagParamResult(
    name,
    value = '',
    score = 0,
    exists = true,
    valid = true,
  ) {
    return {
      name,
      value,
      score,
      exists,
      valid,
    };
  }

  static DefaultScore = {
    OPTIONAL_PARAM: 0.5,
    OPTIONAL_PARAM_MISSING: 0,
    OPTIONAL_PARAM_VALIDATED: 1,
    REQUIRED_PARAM: 4,
    REQUIRED_PARAM_MISSING: -5,
    REQUIRED_PARAM_VALIDATED: 5,
  };

  constructor(vastParams, vastTagType, implementationType) {
    this.vastTagType = vastTagType;
    this.implementationType = implementationType;
    this.vastParams = vastParams;
    this.state = {
      vastUrl: '',
      analysisResult: null,
      metadata: null,
      vastAdTagParameters: null,
      webValidationRules: null,
    };
  }

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
      'VAST URL for',
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

    // Define Rules
    const requiredParametersRules = rules.parameters.required;
    const programmaticRequiredParamsRules =
      rules.parameters.programmatic.required;
    const programmaticRecommendedParamsRules =
      rules.parameters.programmatic.recommended;

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
      if (programmaticRecommendedParamsRules.includes('description_url')) {
        programmaticRecommendedParamsRules.splice(
          programmaticRecommendedParamsRules.indexOf('description_url'),
          1,
        );
      }
    }

    // Create Results
    const requiredParamsResult = this.validateRequiredParameters(
      this.vastParams,
      requiredParametersRules,
    );
    const programmaticRequiredParamsResult = this.validateRequiredParameters(
      this.vastParams,
      programmaticRequiredParamsRules.filter(
        (param) => !requiredParametersRules.includes(param),
      ),
    );
    const programmaticRecommendedParamsResult = this.validateOptionalParameters(
      this.vastParams,
      programmaticRecommendedParamsRules.filter(
        (param) =>
          !requiredParametersRules.includes(param) &&
          !programmaticRequiredParamsRules.includes(param),
      ),
      true,
    );
    const otherParamsResult = this.validateOptionalParameters(
      this.vastParams,
      Object.keys(this.vastParams).filter(
        (param) =>
          !requiredParametersRules.includes(param) &&
          !programmaticRequiredParamsRules.includes(param) &&
          !programmaticRecommendedParamsRules.includes(param),
      ),
      true,
    );

    const analysis = {
      date: new Date(),
      parameters: {
        required: requiredParamsResult,
        programmatic: {
          required: programmaticRequiredParamsResult,
          recommended: programmaticRecommendedParamsResult,
        },
        other: otherParamsResult,
      },
    };
    console.log('Analysis', analysis);
    return { success: true, analysis };
  }

  validateRequiredParameters(parameters, requiredParams) {
    return this.validateParameters(parameters, requiredParams);
  }

  validateOptionalParameters(parameters, optionalParams) {
    return this.validateParameters(parameters, optionalParams, true);
  }

  validateParameters(parameters, requiredParams, optionalParameter = false) {
    // Results
    const parameterResult = {
      params: {},
      score: 0,
      missing: 0,
      invalid: 0,
      valid: 0,
      total: requiredParams.length,
    };

    // Validate required parameters
    requiredParams.forEach((param) => {
      const vastAdTagParameter = vastAdTagParameters.find(
        (entry) => entry.name === param,
      );
      const vastAdTagParameterValidation = vastAdTagParameter
        ? vastAdTagParameter.validation
        : null;
      if (!(param in parameters)) {
        console.error('Missing parameter', param);
        parameterResult.params[param] = VastURLAnalyzer.tagParamResult(
          param,
          '',
          optionalParameter
            ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM_MISSING
            : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM_MISSING,
          false,
          false,
        );
        parameterResult.score += parameterResult.params[param].score;
        parameterResult.missing++;
      } else {
        if (vastAdTagParameterValidation) {
          const validation = new RegExp(vastAdTagParameterValidation);
          if (!validation.test(parameters[param])) {
            console.warn('Invalid parameter value', param, parameters[param]);
            parameterResult.params[param] = VastURLAnalyzer.tagParamResult(
              param,
              parameters[param],
              optionalParameter
                ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM_MISSING
                : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM_MISSING,
              true,
              false,
            );
            parameterResult.score += parameterResult.params[param].score;
            parameterResult.invalid++;
          } else {
            console.info('Validated parameter', param, ':', parameters[param]);
            parameterResult.params[param] = VastURLAnalyzer.tagParamResult(
              param,
              parameters[param],
              optionalParameter
                ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM_VALIDATED
                : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM_VALIDATED,
            );
            parameterResult.score += parameterResult.params[param].score;
            parameterResult.valid++;
          }
        } else {
          console.warn('Missing validation for parameter', param);
          parameterResult.params[param] = VastURLAnalyzer.tagParamResult(
            param,
            parameters[param],
            optionalParameter
              ? VastURLAnalyzer.DefaultScore.OPTIONAL_PARAM
              : VastURLAnalyzer.DefaultScore.REQUIRED_PARAM,
          );
          parameterResult.score += parameterResult.params[param].score;
          parameterResult.valid++;
        }
      }
    });
    return parameterResult;
  }
}

export default VastURLAnalyzer;
