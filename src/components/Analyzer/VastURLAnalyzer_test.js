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
 * @fileoverview Tests for VastURLAnalyzer class.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import VastURLAnalyzer from './VastURLAnalyzer.js';
import { IMPLEMENTATION_TYPE, TAG_TYPE } from '../../constants/index.js';

describe('aconp and vconp Parameter Validation', () => {
  describe('Mutual exclusivity', () => {
    it('Should show error when both aconp and vconp are present', () => {
      const testUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?aconp=1&vconp=1&iu=/test&output=vast&sz=640x480&url=test&gdfp_req=1&env=vp&correlator=123';
      const testParams = {
        aconp: '1',
        vconp: '1',
        iu: '/test',
        output: 'vast',
        sz: '640x480',
        url: 'test',
        gdfp_req: '1',
        env: 'vp',
        correlator: '123',
      };
      const analyzer = new VastURLAnalyzer(
        testUrl,
        testParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.WEB,
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };
      expect(allParams.aconp.valid).toBe(false);
      expect(allParams.vconp.valid).toBe(false);
      expect(allParams.aconp.warning).toContain('mutually exclusive');
      expect(allParams.vconp.warning).toContain('mutually exclusive');
    });
  });

  describe('Audio implementation type validation', () => {
    it('Should allow aconp for audio implementation type', () => {
      const testUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?aconp=1&iu=/test&output=vast&url=test&gdfp_req=1&env=vp&correlator=123&ad_type=audio';
      const testParams = {
        aconp: '1',
        iu: '/test',
        output: 'vast',
        url: 'test',
        gdfp_req: '1',
        env: 'vp',
        correlator: '123',
        ad_type: 'audio',
      };
      const analyzer = new VastURLAnalyzer(
        testUrl,
        testParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.AUDIO,
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };
      expect(allParams.aconp.valid).toBe(true);
      expect(allParams.aconp.warning).toBe('');
    });

    it('Should warn when aconp is used for non-audio implementation type', () => {
      const testUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?aconp=1&iu=/test&output=vast&sz=640x480&url=test&gdfp_req=1&env=vp&correlator=123&description_url=test';
      const testParams = {
        aconp: '1',
        iu: '/test',
        output: 'vast',
        sz: '640x480',
        url: 'test',
        gdfp_req: '1',
        env: 'vp',
        correlator: '123',
        description_url: 'test',
      };
      const analyzer = new VastURLAnalyzer(
        testUrl,
        testParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.WEB,
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };
      expect(allParams.aconp.warning).toContain(
        'aconp parameter is intended for audio tags only',
      );
    });

    it('Should warn when vconp is used for audio implementation type', () => {
      const testUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?vconp=1&iu=/test&output=vast&url=test&gdfp_req=1&env=vp&correlator=123&ad_type=audio';
      const testParams = {
        vconp: '1',
        iu: '/test',
        output: 'vast',
        url: 'test',
        gdfp_req: '1',
        env: 'vp',
        correlator: '123',
        ad_type: 'audio',
      };
      const analyzer = new VastURLAnalyzer(
        testUrl,
        testParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.AUDIO,
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };
      expect(allParams.vconp.warning).toContain(
        'vconp parameter is not suitable for audio implementation',
      );
    });
  });

  describe('Video implementation type validation', () => {
    it('Should allow vconp for video implementation types', () => {
      const testUrl =
        'https://pubads.g.doubleclick.net/gampad/ads?vconp=1&iu=/test&output=vast&sz=640x480&url=test&gdfp_req=1&env=vp&correlator=123&description_url=test';
      const testParams = {
        vconp: '1',
        iu: '/test',
        output: 'vast',
        sz: '640x480',
        url: 'test',
        gdfp_req: '1',
        env: 'vp',
        correlator: '123',
        description_url: 'test',
      };
      const analyzer = new VastURLAnalyzer(
        testUrl,
        testParams,
        TAG_TYPE.STANDARD,
        IMPLEMENTATION_TYPE.WEB,
      );
      const result = analyzer.analyze();
      expect(result.success).toBe(true);

      const allParams = {
        ...result.analysisResult.requiredParameters,
        ...result.analysisResult.programmaticRequiredParameters,
        ...result.analysisResult.programmaticRecommendedParameters,
        ...result.analysisResult.otherParameters,
      };
      expect(allParams.vconp.valid).toBe(true);
      expect(allParams.vconp.warning).toBe('');
    });
  });
});
