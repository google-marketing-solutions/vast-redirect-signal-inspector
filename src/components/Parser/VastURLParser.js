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
 * @fileoverview VAST URL Parser to extract parameters from a VAST URL.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @class
 */
class VastURLParser {
  static ErrorCode = {
    URL_EMPTY: 'URL is empty.',
  };

  /**
   * @param {string} url
   * @constructor
   */
  constructor(url) {
    this.url = url;
  }

  /**
   * @return {Object}
   */
  parse() {
    if (!this.url) {
      return { success: false, error: VastURLParser.ErrorCode.URL_EMPTY };
    }

    const params = {};
    const queryString = this.url.includes('?') ? this.url.split('?')[1] : '';
    if (queryString) {
      queryString.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        const decodedKey = decodeURIComponent(key);
        const decodedValue = value ? decodeURIComponent(value) : '';
        if (decodedKey === 'cust_params') {
          const custParams = decodeURIComponent(decodedValue);
          const custParamsList = {};
          if (custParams.includes('&')) {
            custParams.split('&').forEach((custParam) => {
              const [custKey, custValue] = custParam.split('=');
              custParamsList[decodeURIComponent(custKey)] =
                decodeURIComponent(custValue);
            });
          } else {
            const [custKey, custValue] = custParams.split('=');
            custParamsList[decodeURIComponent(custKey)] =
              decodeURIComponent(custValue);
          }
          params[decodedKey] = custParamsList;
        } else {
          params[decodedKey] = decodeURIComponent(value);
        }
      });
    }

    return { success: true, params };
  }
}

export default VastURLParser;
