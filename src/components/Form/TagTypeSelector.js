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
 * @fileoverview Tag type selector component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as styles from './style.module.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

/**
 * Tag type selector with warning indicator and example button
 * @return {JSX.Element} The TagTypeSelector component
 */
const TagTypeSelector = ({
  selectedTagType,
  url,
  showWarning,
  tagTypes,
  exampleUrls,
  onTagTypeChange,
  onExampleClick,
}) => {
  return (
    <Box className={styles.formControl}>
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {showWarning && (
            <Tooltip title="Manually selected tag type does not match the automatically detected tag type.">
              <IconButton aria-label="warning" color="warning">
                <WarningIcon />
              </IconButton>
            </Tooltip>
          )}
          <RadioGroup
            aria-label="vast-tag-type"
            className="vast-tag-type-radio-group"
            name="vastTagType"
            value={selectedTagType}
            onChange={onTagTypeChange}
            row
            sx={{ justifyContent: 'center' }}
          >
            {Object.values(tagTypes)
              .filter(
                (type) =>
                  type !== tagTypes.UNKNOWN ||
                  selectedTagType === tagTypes.UNKNOWN,
              )
              .map((type) => (
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
          <Button
            variant="outlined"
            startIcon={<PlayCircleOutlineIcon />}
            onClick={onExampleClick}
            className={styles.exampleButton}
            disabled={
              exampleUrls[selectedTagType] === undefined ||
              url === exampleUrls[selectedTagType]
            }
          >
            Load Example
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};

TagTypeSelector.propTypes = {
  selectedTagType: PropTypes.string.isRequired,
  detectedTagType: PropTypes.string,
  url: PropTypes.string.isRequired,
  showWarning: PropTypes.bool,
  tagTypes: PropTypes.object.isRequired,
  exampleUrls: PropTypes.object.isRequired,
  onTagTypeChange: PropTypes.func.isRequired,
  onExampleClick: PropTypes.func.isRequired,
};

TagTypeSelector.defaultProps = {
  showWarning: false,
  detectedTagType: '',
};

export default TagTypeSelector;
