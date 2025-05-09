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
 * @fileoverview Encoder for sharing the analysis state.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

export function encodeState(state) {
  return compressToEncodedURIComponent(JSON.stringify(state));
}

export function decodeState(encoded) {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode shared state', e);
    return null;
  }
}
