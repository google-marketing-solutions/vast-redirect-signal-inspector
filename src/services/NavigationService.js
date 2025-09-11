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
 * @fileoverview Navigation service for the VAST Redirect Signal Inspector.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * @param {string} key - The navigation key
 */
export const handleNavigation = (key) => {
  switch (key) {
    case 'Home':
      window.location.href = '/vast-redirect-signal-inspector/';
      break;
    case 'Source':
      window.open(
        'https://github.com/google-marketing-solutions/vast-redirect-signal-inspector',
      );
      break;
    case 'Issues':
      window.open(
        'https://github.com/google-marketing-solutions/vast-redirect-signal-inspector/issues',
      );
      break;
    case 'Help':
      window.open('https://support.google.com/admanager/answer/10678356');
      break;
    default:
      break;
  }
};
