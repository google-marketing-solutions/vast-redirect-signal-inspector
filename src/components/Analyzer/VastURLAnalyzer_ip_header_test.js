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
 * @fileoverview Tests for IP Header functionality in VastURLAnalyzer class.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import VastURLAnalyzer from './VastURLAnalyzer.js';
import { IMPLEMENTATION_TYPE, TAG_TYPE } from '../../constants/index.js';

describe('IP Header Parameter Validation for PAI Tags', () => {
  const PAI_URL_WITHOUT_IP =
    'https://serverside.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&ssss=vast_url_validator_test&correlator=12345';

  const PAI_PARAMS_WITHOUT_IP = {
    iu: '/21775744923/external/single_ad_samples',
    sz: '640x480',
    cust_params: { sample_ct: 'linear' },
    ciu_szs: '300x250,728x90',
    gdfp_req: '1',
    output: 'vast',
    unviewed_position_start: '1',
    env: 'vp',
    impl: 's',
    ssss: 'vast_url_validator_test',
    correlator: '12345',
    // Note: 'ip' parameter is missing
  };

  describe('PAI tag without IP parameter', () => {
    it('Should show IP parameter as missing when ipViaHttpHeader is false', () => {
      const analyzer = new VastURLAnalyzer(
        PAI_URL_WITHOUT_IP,
        PAI_PARAMS_WITHOUT_IP,
        TAG_TYPE.PAI,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: false },
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };

      // IP should be required but missing
      expect(allParams.ip).toBeDefined();
      expect(allParams.ip.exists).toBe(false);
      expect(allParams.ip.valid).toBe(false);
      expect(allParams.ip.override).toBe(false);
    });

    it('Should show IP parameter as satisfied when ipViaHttpHeader is true', () => {
      const analyzer = new VastURLAnalyzer(
        PAI_URL_WITHOUT_IP,
        PAI_PARAMS_WITHOUT_IP,
        TAG_TYPE.PAI,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: true },
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };

      // IP should be overridden and valid
      expect(allParams.ip).toBeDefined();
      expect(allParams.ip.override).toBe(true);
      expect(allParams.ip.valid).toBe(true);
    });
  });

  describe('PAI+PAL tag without IP parameter', () => {
    it('Should show IP parameter as satisfied when ipViaHttpHeader is true', () => {
      const analyzer = new VastURLAnalyzer(
        PAI_URL_WITHOUT_IP,
        PAI_PARAMS_WITHOUT_IP,
        TAG_TYPE.PAI_PAL,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: true },
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };

      // IP should be overridden and valid for PAI+PAL as well
      expect(allParams.ip).toBeDefined();
      expect(allParams.ip.override).toBe(true);
      expect(allParams.ip.valid).toBe(true);
    });
  });

  describe('Non-PAI tags should not be affected by ipViaHttpHeader option', () => {
    it('Should ignore ipViaHttpHeader option for Standard tags', () => {
      const standardUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?iu=/123456789/example&sz=300x250&cust_params=test%3Dtrue&output=vast&correlator=12345';

      const standardParams = {
        iu: '/123456789/example',
        sz: '300x250',
        cust_params: { test: 'true' },
        output: 'vast',
        correlator: '12345',
      };

      const analyzerWithoutOption = new VastURLAnalyzer(
        standardUrl,
        standardParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: false },
      );

      const analyzerWithOption = new VastURLAnalyzer(
        standardUrl,
        standardParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: true },
      );

      const resultWithoutOption = analyzerWithoutOption.analyze();
      const resultWithOption = analyzerWithOption.analyze();

      // Both results should be identical - IP should not be required for Standard tags
      expect(resultWithoutOption.success).toBe(true);
      expect(resultWithOption.success).toBe(true);

      const paramsWithoutOption = {
        ...resultWithoutOption.analysisResult.requiredParameters,
        ...resultWithoutOption.analysisResult.programmaticRequiredParameters,
        ...resultWithoutOption.analysisResult.programmaticRecommendedParameters,
        ...resultWithoutOption.analysisResult.otherParameters,
      };

      const paramsWithOption = {
        ...resultWithOption.analysisResult.requiredParameters,
        ...resultWithOption.analysisResult.programmaticRequiredParameters,
        ...resultWithOption.analysisResult.programmaticRecommendedParameters,
        ...resultWithOption.analysisResult.otherParameters,
      };

      // IP should not be required for Standard tags in either case
      expect(paramsWithoutOption.ip).toBeUndefined();
      expect(paramsWithOption.ip).toBeUndefined();
    });

    it('Should ignore ipViaHttpHeader option for PAL tags', () => {
      const palUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?iu=/123456789/example&sz=300x250&output=vast&correlator=12345';

      const palParams = {
        iu: '/123456789/example',
        sz: '300x250',
        output: 'vast',
        correlator: '12345',
      };

      const analyzerWithoutOption = new VastURLAnalyzer(
        palUrl,
        palParams,
        TAG_TYPE.PAL,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: false },
      );

      const analyzerWithOption = new VastURLAnalyzer(
        palUrl,
        palParams,
        TAG_TYPE.PAL,
        IMPLEMENTATION_TYPE.WEB,
        { ipViaHttpHeader: true },
      );

      const resultWithoutOption = analyzerWithoutOption.analyze();
      const resultWithOption = analyzerWithOption.analyze();

      // Both results should be identical - IP should not be required for PAL tags
      expect(resultWithoutOption.success).toBe(true);
      expect(resultWithOption.success).toBe(true);

      const paramsWithoutOption = {
        ...resultWithoutOption.analysisResult.requiredParameters,
        ...resultWithoutOption.analysisResult.programmaticRequiredParameters,
        ...resultWithoutOption.analysisResult.programmaticRecommendedParameters,
        ...resultWithoutOption.analysisResult.otherParameters,
      };

      const paramsWithOption = {
        ...resultWithOption.analysisResult.requiredParameters,
        ...resultWithOption.analysisResult.programmaticRequiredParameters,
        ...resultWithOption.analysisResult.programmaticRecommendedParameters,
        ...resultWithOption.analysisResult.otherParameters,
      };

      // IP should not be required for PAL tags in either case
      expect(paramsWithoutOption.ip).toBeUndefined();
      expect(paramsWithOption.ip).toBeUndefined();
    });
  });
});
