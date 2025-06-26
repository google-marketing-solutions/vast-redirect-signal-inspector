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
        <b>Enter your VAST URL</b>
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
    placement: 'bottom',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    scrollOffset: 100,
  },
  {
    target: '.vast-tag-type-radio-group',
    content: (
      <div>
        <b>Check VAST Tag Type</b>
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
    placement: 'right',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
  },
  {
    target: '.implementation-type-radio-group',
    content: (
      <div>
        <b>Set Implementation Type</b>
        <br />
        Choose the Implementation Type that applies to your setup. Different
        requirements and checks will be applied depending on your selection.
        <br />
        <small>
          <i>This must be selected manually!</i>
        </small>
      </div>
    ),
    placement: 'right',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
  },
  {
    target: '.analyze-button',
    content: (
      <div>
        <b>Analyze</b>
        <br />
        Click this button to analyze your VAST URL. The result will be shown
        below.
      </div>
    ),
    placement: 'right',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    disableBeacon: true,
  },
  {
    target: '.analyze-button',
    content: 'After clicking, the analysis will start...',
  },
  {
    target: '.vast-url-score-result',
    content: (
      <div>
        <b>Score Overview</b>
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
    placement: 'top',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    scrollOffset: 150,
    disableBeacon: true,
  },
  {
    target: '.vast-url-parameters-required-parameters',
    content: (
      <div>
        <b>Required Parameters</b>
        <br />
        These parameters are mandatory for your selected implementation type.
        Make sure all are present and valid (green checkmarks).
        <br />
        <small>
          <i>
            Missing or invalid required parameters significantly impact the
            functionality and quality of your VAST tag.
          </i>
        </small>
      </div>
    ),
    placement: 'left',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    scrollOffset: 50,
  },
  {
    target: '.vast-url-parameters-required-programmatic-parameters',
    content: (
      <div>
        <b>Required Programmatic Parameters</b>
        <br />
        These parameters are essential for programmatic use cases. They enable
        proper ad serving in programmatic environments.
        <br />
        <small>
          <i>
            Parameters like vpmute und vpa are also recommended per
            <a href="http://mediaratingcouncil.org/">
              The Media Rating Council (MRC) Video Measurement Guidelines
            </a>
            .
          </i>
        </small>
      </div>
    ),
    placement: 'left',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    scrollOffset: 50,
  },
  {
    target: '.vast-url-parameters-recommended-programmatic-parameters',
    content: (
      <div>
        <b>Recommended Programmatic Parameters</b>
        <br />
        While optional, these parameters improve ad delivery and reporting in
        programmatic contexts. They provide additional information to help
        optimize the ad experience.
        <br />
        <small>
          <i>
            Including these parameters can improve targeting, reporting
            accuracy, and overall ad performance.
          </i>
        </small>
      </div>
    ),
    placement: 'left',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    scrollOffset: 50,
  },
  {
    target: '.vast-url-parameters-other-parameters',
    content: (
      <div>
        <b>Other Parameters</b>
        <br />
        Additional parameters detected in your VAST URL that don&apos;t fall
        into the previous categories. Check for any orange warnings that
        indicate accepted but not recommended values.
        <br />
        <small>
          <i>
            These parameters may not be essential but can provide useful
            information or functionality. Make sure they are valid and correctly
            formatted.
          </i>
        </small>
      </div>
    ),
    placement: 'top',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
    scrollOffset: 50,
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
    placement: 'bottom',
    floaterProps: {
      options: {
        preventOverflow: { enabled: true, boundariesElement: 'viewport' },
      },
    },
    scrollToSteps: true,
  },
];

export default vastTourSteps;
