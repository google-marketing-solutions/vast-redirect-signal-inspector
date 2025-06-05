/**
 * @license Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Self-contained test suite for the sdkParameters.json file.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import sdkParameters from './sdkParameters.json'; // Adjust path if necessary

describe('sdkParameters.json structure and content', () => {
  it('Should be an array', () => {
    expect(Array.isArray(sdkParameters)).toBe(true);
  });

  sdkParameters.forEach((param) => {
    describe(`Parameter: ${param.name || 'Unnamed Parameter'}`, () => {
      it('Should have a "name" property as a non-empty string', () => {
        expect(param.name).toBeDefined();
        expect(typeof param.name).toBe('string');
        expect(param.name.length).toBeGreaterThan(0);
      });

      it('Should have an "sdkHandlingInfo" property as a non-empty string', () => {
        expect(param.sdkHandlingInfo).toBeDefined();
        expect(typeof param.sdkHandlingInfo).toBe('string');
        expect(param.sdkHandlingInfo.length).toBeGreaterThan(0);
      });

      it('Should have an "sdk" property as a non-empty array of strings', () => {
        expect(param.sdk).toBeDefined();
        expect(Array.isArray(param.sdk)).toBe(true);
        expect(param.sdk.length).toBeGreaterThan(0);
        param.sdk.forEach((sdkTag) => {
          expect(typeof sdkTag).toBe('string');
          expect(sdkTag.length).toBeGreaterThan(0);
        });
      });

      it('All parameter names should be unique', () => {
        const names = sdkParameters.map((p) => p.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
      });
    });
  });
});
