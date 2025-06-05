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
 * @fileoverview PAL Nonce Parameters Validation
 * @author mbordihn@google.com (Markus Bordihn)
 */

import palNonceParameters from './palNonceParameters.json';

describe('vastAdTagParameters Validation', () => {
  it('Should be an array', () => {
    expect(Array.isArray(palNonceParameters)).toBe(true);
  });

  palNonceParameters.forEach((item) => {
    it(`Should validate ${item.name} example against the validation regex`, () => {
      const examples = item.examples;
      const validation = item.validation;
      examples.forEach((example) => {
        const regex = new RegExp(validation);
        expect(regex.test(example)).toBe(true);
      });
    });

    it(`Should invalidate an incorrect string for ${item.name}`, () => {
      const example = 'Invalid String';
      const validation = item.validation;

      const regex = new RegExp(validation);
      expect(regex.test(example)).toBe(false);
    });
  });
});
