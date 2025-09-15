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
 * @fileoverview VAST URL Parameters Reporting component.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import ParameterTable from './ParameterTable';
import VastResponse from './VastResponse';

/**
 * @class
 */
class VastURLParameters extends React.PureComponent {
  /**
   * @param {*} props
   * @constructor
   */
  constructor(props) {
    super(props);
  }

  /**
   * @return {React.ReactNode}
   * @override
   */
  render() {
    const { data, showDebug, onRefreshVast } = this.props;
    const analysisResult = data || {};

    return (
      <div style={{ maxWidth: '100%', width: '100%', margin: '0 auto' }}>
        <ParameterTable
          params={analysisResult.requiredParameters}
          title="Required Parameters"
          showDebug={showDebug}
        />
        <ParameterTable
          params={analysisResult.programmaticRequiredParameters}
          title="Required Programmatic Parameters"
          showDebug={showDebug}
        />
        <ParameterTable
          params={analysisResult.programmaticRecommendedParameters}
          title="Recommended Programmatic Parameters"
          showDebug={showDebug}
        />
        <ParameterTable
          params={analysisResult.otherParameters}
          title="Other Parameters"
          showDebug={showDebug}
        />
        <VastResponse
          vastResponse={analysisResult.vastResponse}
          onRefresh={onRefreshVast}
        />
      </div>
    );
  }
}

VastURLParameters.propTypes = {
  data: PropTypes.object,
  showDebug: PropTypes.bool,
  onRefreshVast: PropTypes.func,
};

VastURLParameters.defaultProps = {
  data: null,
  showDebug: false,
};

export default VastURLParameters;
