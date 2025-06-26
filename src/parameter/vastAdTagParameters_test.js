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
 * @fileoverview VAST Ad Tag Parameters Validation
 * @author mbordihn@google.com (Markus Bordihn)
 */

import vastAdTagParameters from './vastAdTagParameters.json';

describe('vastAdTagParameters Validation', () => {
  vastAdTagParameters.forEach((item) => {
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

    if (item.accepted && item.accepted.validation) {
      it(`Should validate accepted but not recommended values for ${item.name}`, () => {
        let acceptedExamples = [];
        if (
          item.validation === '^(0|1)$' &&
          item.accepted.validation === '^(false|true)$'
        ) {
          acceptedExamples = ['false', 'true'];
        } else if (item.accepted.examples) {
          acceptedExamples = item.accepted.examples;
        } else {
          return;
        }

        const acceptedRegex = new RegExp(item.accepted.validation);
        const mainRegex = new RegExp(item.validation);

        // Each accepted example should pass the accepted validation
        acceptedExamples.forEach((example) => {
          expect(acceptedRegex.test(example)).toBe(true);
          expect(mainRegex.test(example)).toBe(false);
        });

        // Mock validation function to test combined logic
        const isValid = (value) =>
          mainRegex.test(value) || acceptedRegex.test(value);
        const shouldWarn = (value) =>
          !mainRegex.test(value) && acceptedRegex.test(value);

        // Check that main examples don't trigger warnings
        item.examples.forEach((example) => {
          expect(isValid(example)).toBe(true);
          expect(shouldWarn(example)).toBe(false);
        });

        // Check that accepted examples do trigger warnings
        acceptedExamples.forEach((example) => {
          expect(isValid(example)).toBe(true);
          expect(shouldWarn(example)).toBe(true);
        });
      });
    }
  });
});

describe('vastAdTagParameters Alias Mapping', () => {
  const parameterMap = {};

  vastAdTagParameters.forEach((item) => {
    parameterMap[item.name] = item;
    if (item.aliases) {
      item.aliases.forEach((alias) => {
        parameterMap[alias] = item;
      });
    }
  });

  vastAdTagParameters.forEach((item) => {
    if (item.aliases) {
      it(`All aliases "${item.aliases} of "${item.name}" should map to the same object`, () => {
        item.aliases.forEach((alias) => {
          expect(parameterMap[alias]).toBe(parameterMap[item.name]);
        });
      });
    }
  });
});

describe('vastAdTagParameters - Unique Names and Aliases', () => {
  it('Should have unique names and aliases across all parameters', () => {
    const seen = new Set();

    vastAdTagParameters.forEach((item) => {
      expect(seen.has(item.name)).toBe(false);
      seen.add(item.name);

      if (item.aliases) {
        item.aliases.forEach((alias) => {
          expect(seen.has(alias)).toBe(false);
          seen.add(alias);
        });
      }
    });
  });
});
