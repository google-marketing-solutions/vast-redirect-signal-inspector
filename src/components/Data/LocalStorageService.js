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
 * @fileoverview Local Storage Service for managing local storage operations.
 * @author mbordihn@google.com (Markus Bordihn)
 */

class LocalStorageService {
  /**
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  static getItem(key, defaultValue = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * @param {string} key
   * @param {any} value
   * @returns {boolean}
   */
  static setItem(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  static removeItem(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @returns {boolean}
   */
  static clear() {
    try {
      window.localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
}

export default LocalStorageService;
