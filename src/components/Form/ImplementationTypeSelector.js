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
 * @fileoverview Implementation type selector component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

/**
 * Radio button group for selecting implementation types
 * @return {JSX.Element} The ImplementationTypeSelector component
 */
const ImplementationTypeSelector = ({
  selectedType,
  implementationTypes,
  onChange,
}) => {
  return (
    <FormControl
      component="fieldset"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <Typography variant="body1">Implementation Type:</Typography>
      <RadioGroup
        aria-label="implementation-type"
        className="implementation-type-radio-group"
        name="implementationType"
        value={selectedType}
        onChange={onChange}
        row
      >
        {Object.values(implementationTypes).map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio />}
            label={type
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

ImplementationTypeSelector.propTypes = {
  selectedType: PropTypes.string.isRequired,
  implementationTypes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ImplementationTypeSelector;
