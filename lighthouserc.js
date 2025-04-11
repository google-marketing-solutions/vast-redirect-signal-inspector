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

const { TAG_TYPE, EXAMPLE_VAST_URLS } = require('./src/constants/index.js');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start:lighthouse',
      startServerReadyTimeout: 25000,
      url: [
        'http://localhost:8086',
        'http://localhost:8086/?redirect=' +
          encodeURIComponent(EXAMPLE_VAST_URLS[TAG_TYPE.IMA_SDK]),
        'http://localhost:8086/?redirect=' +
          encodeURIComponent(EXAMPLE_VAST_URLS[TAG_TYPE.PAL]),
        'http://localhost:8086/?redirect=' +
          encodeURIComponent(EXAMPLE_VAST_URLS[TAG_TYPE.PAL_LEGACY]),
        'http://localhost:8086/?redirect=' +
          encodeURIComponent(EXAMPLE_VAST_URLS[TAG_TYPE.PAI]),
        'http://localhost:8086/?redirect=' +
          encodeURIComponent(EXAMPLE_VAST_URLS[TAG_TYPE.STANDARD]),
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
