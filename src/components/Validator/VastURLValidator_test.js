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
 * @fileoverview VAST URL Validator Test
 * @author mbordihn@google.com (Markus Bordihn)
 */

import VastURLValidator from './VastURLValidator';
import { TAG_TYPE, EXAMPLE_VAST_URLS } from '../../constants';

const internalVastUrl =
  'https://dasmk3n34n342i342n.corp.google.com/gampad/ads?';

describe('VastURLValidator', () => {
  it('Should return an error for an empty URL', () => {
    const validator = new VastURLValidator('');
    const result = validator.validate();
    expect(result.success).toBe(false);
    expect(result.error).toBe(VastURLValidator.ErrorCode.URL_EMPTY);
  });

  it('Should return an error for an invalid URL', () => {
    const validator = new VastURLValidator('invalid-url');
    const result = validator.validate();
    expect(result.success).toBe(false);
    expect(result.error).toBe(VastURLValidator.ErrorCode.INVALID_URL);
  });

  it('Should correctly identify a standard VAST URL (pubads.)', () => {
    const validator = new VastURLValidator(
      EXAMPLE_VAST_URLS[TAG_TYPE.STANDARD],
    );
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.STANDARD);
  });

  it('Should correctly identify a standard VAST URL (securepubads.)', () => {
    const validator = new VastURLValidator(
      EXAMPLE_VAST_URLS[TAG_TYPE.STANDARD].replace(
        'https://pubads.',
        'https://securepubads.',
      ),
    );
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.STANDARD);
  });

  it('Should correctly identify a standard VAST URL (internal)', () => {
    const validator = new VastURLValidator(internalVastUrl);
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.STANDARD);
  });

  it('Should correctly identify a PAL VAST URL', () => {
    const validator = new VastURLValidator(EXAMPLE_VAST_URLS[TAG_TYPE.PAL]);
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.PAL);
  });

  it('Should correctly identify a legacy PAL VAST URL', () => {
    const validator = new VastURLValidator(
      EXAMPLE_VAST_URLS[TAG_TYPE.PAL_LEGACY],
    );
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.PAL_LEGACY);
  });

  it('Should correctly identify a PAI VAST URL (serverside.)', () => {
    const validator = new VastURLValidator(EXAMPLE_VAST_URLS[TAG_TYPE.PAI]);
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.PAI);
  });

  it('Should correctly identify an IMA SDK VAST URL (pagead2.)', () => {
    const validator = new VastURLValidator(EXAMPLE_VAST_URLS[TAG_TYPE.IMA_SDK]);
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.IMA_SDK);
  });

  it("Should return 'Unknown' for a URL with an unknown hostname", () => {
    const unknownUrl =
      'https://www.example.com/ads?iu=/21775744923/external/single_ad_samples';
    const validator = new VastURLValidator(unknownUrl);
    const result = validator.validate();
    expect(result.success).toBe(true);
    expect(result.tagType).toBe(TAG_TYPE.UNKNOWN);
  });

  it('Should return an error for an invalid protocol', () => {
    const invalidUrl =
      'ftp://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples';
    const validator = new VastURLValidator(invalidUrl);
    const result = validator.validate();
    expect(result.success).toBe(false);
    expect(result.error).toBe(VastURLValidator.ErrorCode.INVALID_URL);
  });
});
