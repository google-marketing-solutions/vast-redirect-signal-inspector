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

/**
 * @class
 */
class VastURLValidator {
  static ErrorCode = {
    URL_EMPTY: 'URL is empty.',
    INVALID_URL: 'Invalid URL.',
  };

  /**
   * @param {URL} url
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * @return {Object}
   */
  validate() {
    if (!this.url) {
      return {
        success: false,
        error: VastURLValidator.ErrorCode.URL_EMPTY,
        tagType: TAG_TYPE.UNKNOWN,
      };
    }

    try {
      const parsedUrl = new URL(this.url);
      const hostname = parsedUrl.hostname;
      const searchParams = parsedUrl.searchParams;

      let tagType = TAG_TYPE.UNKNOWN;
      if (
        hostname === 'pubads.g.doubleclick.net' ||
        hostname === 'securepubads.g.doubleclick.net'
      ) {
        if (searchParams.has('givn')) {
          tagType = TAG_TYPE.PAL;
        } else {
          tagType = TAG_TYPE.STANDARD;
        }
      } else if (
        hostname === 'serverside.doubleclick.net' &&
        searchParams.has('ssss')
      ) {
        tagType = TAG_TYPE.PAI;
      } else if (
        hostname === 'pagead2.googlesyndication.com' &&
        searchParams.has('sdkv')
      ) {
        tagType = TAG_TYPE.IMA_SDK;
      }
      return { success: true, tagType };
    } catch (error) {
      return {
        success: false,
        error: VastURLValidator.ErrorCode.INVALID_URL,
        error_message: error.message,
        tagType: TAG_TYPE.UNKNOWN,
      };
    }
  }
}

export default VastURLValidator;
