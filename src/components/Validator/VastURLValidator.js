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
 * @fileoverview VAST URL Validator for Google Ad Manager VAST tags.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { TAG_TYPE } from '../../constants';

class VastURLValidator {
  static ErrorCode = {
    URL_EMPTY: 'Empty URL.',
    INVALID_URL: 'Invalid URL.',
  };
  static WarningCode = {
    LEGACY_PAL_TAG: 'Legacy PAL tag.',
  };
  static WarningMessage = {
    LEGACY_PAL_TAG:
      'You are using a legacy PAL tag, please update the tag and use the new `givn` parameter instead!',
  };

  /**
   * @param {string} url - The VAST URL to validate
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * @return {Object} Validation result with success status, errors, and detected tag type
   */
  validate() {
    if (!this.url) {
      return {
        success: false,
        error: VastURLValidator.ErrorCode.URL_EMPTY,
        warning: null,
        warning_message: '',
        tagType: TAG_TYPE.UNKNOWN,
      };
    }

    try {
      const parsedUrl = new URL(this.url);
      const hostname = parsedUrl.hostname;
      const pathname = parsedUrl.pathname;
      const protocol = parsedUrl.protocol;
      const searchParams = parsedUrl.searchParams;
      let warningCode = null;
      let warningMessage = '';

      // Check for valid protocol.
      if (protocol !== 'http:' && protocol !== 'https:') {
        return {
          success: false,
          error: VastURLValidator.ErrorCode.INVALID_URL,
          error_message:
            'Invalid protocol ' +
            protocol +
            '. Only http and https are allowed.',
          warning: null,
          warning_message: '',
          tagType: TAG_TYPE.UNKNOWN,
        };
      }

      // Check for valid VAST tags.
      let tagType = TAG_TYPE.UNKNOWN;
      if (
        hostname === 'serverside.doubleclick.net' &&
        searchParams.has('ssss')
      ) {
        if (searchParams.has('givn')) {
          tagType = TAG_TYPE.PAI_PAL;
        } else {
          tagType = TAG_TYPE.PAI;
        }
      } else if (
        hostname === 'pubads.g.doubleclick.net' ||
        hostname === 'securepubads.g.doubleclick.net' ||
        (hostname.endsWith('.corp.google.com') &&
          pathname.startsWith('/gampad/ads'))
      ) {
        if (searchParams.has('givn')) {
          tagType = TAG_TYPE.PAL;
        } else if (searchParams.has('paln')) {
          tagType = TAG_TYPE.PAL_LEGACY;
          warningCode = VastURLValidator.WarningCode.LEGACY_PAL_TAG;
          warningMessage = VastURLValidator.WarningMessage.LEGACY_PAL_TAG;
        } else {
          tagType = TAG_TYPE.STANDARD;
        }
      } else if (
        hostname === 'pagead2.googlesyndication.com' &&
        searchParams.has('sdkv')
      ) {
        tagType = TAG_TYPE.IMA_SDK;
      }
      return {
        warning: warningCode,
        warning_message: warningMessage,
        success: true,
        tagType,
      };
    } catch (error) {
      return {
        success: false,
        error: VastURLValidator.ErrorCode.INVALID_URL,
        error_message: error.message,
        warning: null,
        warning_message: '',
        tagType: TAG_TYPE.UNKNOWN,
      };
    }
  }
}

export default VastURLValidator;
