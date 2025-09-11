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
 * @fileoverview Tour manager component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

// Lazy load Joyride
const Joyride = React.lazy(() => import('react-joyride'));

/**
 * @return {JSX.Element}
 */
const TourManager = ({ run, steps, callback, showTour }) => {
  // Check for global tour disable flag (useful for tests)
  if (typeof window !== 'undefined' && window.__disableTour) {
    return null;
  }

  if (!showTour) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Joyride
        run={run}
        steps={steps}
        continuous
        showSkipButton
        showProgress
        disableOverlayClose={true}
        callback={callback}
        styles={{
          options: { maxWidth: 800, zIndex: 10000 },
          tooltip: {
            minWidth: 480,
            maxWidth: 800,
            fontSize: 16,
            padding: '12px',
          },
        }}
        scrollOffset={128}
      />
    </Suspense>
  );
};

TourManager.propTypes = {
  run: PropTypes.bool.isRequired,
  steps: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  showTour: PropTypes.bool,
};

TourManager.defaultProps = {
  showTour: false,
};

export default TourManager;
