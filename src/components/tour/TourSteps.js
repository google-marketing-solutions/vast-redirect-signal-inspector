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
 * @fileoverview Tour steps for the VAST URL analysis page.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

const vastTourSteps = [
  {
    target: '.vast-redirect-url-input',
    content: (
      <div>
        <b>Step 1: Enter your VAST URL</b>
        <br />
        Add the VAST URL you are sending to the ad server into this field.
        <br />
        <small>
          <i>
            Important: Use the final URL as actually send to the ad server,
            including any replaced macros or placeholders.
          </i>
        </small>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.vast-tag-type-radio-group',
    content: (
      <div>
        <b>Step 2: Check VAST Tag Type</b>
        <br />
        Make sure the detected VAST Tag Type is correct. The radio box updates
        automatically based on the detected type, but you can adjust it if
        needed.
        <br />
        <small>
          <i>
            If the tag is not recognized correctly, double-check your input or
            select the correct type manually.
          </i>
        </small>
      </div>
    ),
    disableScrolling: true,
  },
  {
    target: '.implementation-type-radio-group',
    content: (
      <div>
        <b>Step 3: Set Implementation Type</b>
        <br />
        Choose the Implementation Type that applies to your setup. Different
        requirements and checks will be applied depending on your selection.
        <br />
        <small>
          <i>This must be selected manually!</i>
        </small>
      </div>
    ),
    disableScrolling: true,
  },
  {
    target: '.analyze-button',
    content: (
      <div>
        <b>Step 4: Analyze</b>
        <br />
        Click this button to analyze your VAST URL. The result will be shown
        below.
      </div>
    ),
    disableScrolling: true,
  },
  {
    target: '.not_existed_dummy_to_fix_anchor',
    content: '',
  },
  {
    target: '.vast-url-score-result',
    content: (
      <div>
        <b>Step 5: Score Overview</b>
        <br />
        Here you can see the overall evaluation of your VAST tag, including
        Total Score, Required parameter coverage, Programmatic support, and
        Recommended settings.
        <br />
        <small>
          <i>
            These indicators provide a quick overview of the compliance and
            quality of your VAST tag.
          </i>
        </small>
      </div>
    ),
  },
  {
    target: '.vast-url-parameters-required-parameters',
    content: (
      <div>
        <b>Step 6: Parameter Table</b>
        <br />
        Here you find a detailed breakdown of all detected parameters, their
        values, status, and individual scores. Use this section to identify
        missing or incorrectly configured parameters.
      </div>
    ),
  },
  {
    target: '.share-button',
    content: (
      <div>
        <b>Optional: Share your Analysis</b>
        <br />
        Click here to copy a shareable link to your analysis, which you can send
        to colleagues or support.
      </div>
    ),
  },
];

export default vastTourSteps;
