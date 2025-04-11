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
 * @fileoverview VAST Tag Parameter Result.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @class
 */
class VastTagParameterResult {
  /**
   * @param {string} name
   * @param {string} value
   * @param {number} score
   */
  constructor(name, value = '', score = 0) {
    this._name = name;
    this._value = value;
    this._score = score;
    this._exists = false;
    this._valid = false;
    this._override = false;
    this._deprecated = '';
    this._alias = '';
  }

  /**
   * @return {string}
   */
  get name() {
    return this._name;
  }

  /**
   * @return {string}
   */
  get value() {
    return this._value;
  }

  /**
   * @param {string} value
   */
  get score() {
    return this._score;
  }

  /**
   * @param {number} score
   */
  set score(score) {
    this._score = score;
  }

  /**
   * @return {boolean}
   */
  get exists() {
    return this._exists;
  }

  /**
   * @param {boolean} exists
   */
  set exists(exists) {
    this._exists = exists;
  }

  /**
   * @return {boolean}
   */
  get valid() {
    return this._valid;
  }

  /**
   * @param {boolean} valid
   */
  set valid(valid) {
    this._valid = valid;
  }

  /**
   * @return {boolean}
   */
  get override() {
    return this._override;
  }

  /**
   * @param {boolean} override
   */
  set override(override) {
    this._override = override;
  }

  /**
   * @return {string}
   */
  get deprecated() {
    return this._deprecated;
  }

  /*
   * @param {string} deprecated
   */
  set deprecated(deprecated) {
    this._deprecated = deprecated;
  }

  /**
   * @return {string}
   */
  get alias() {
    return this._alias;
  }

  /**
   * @param {string} alias
   */
  set alias(alias) {
    this._alias = alias;
  }
}

export default VastTagParameterResult;
