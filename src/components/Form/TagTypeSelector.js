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
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';

import TagTypeInfo from './TagTypeInfo';
import * as styles from './style.module.css';

/**
 * @param {string} tagType - The tag type
 * @return {string} Tooltip text
 */
const getTagTypeTooltip = (tagType) => {
  const tooltips = {
    'IMA SDK': 'Interactive Media Ads SDK for client-side video advertising',
    PAL: 'Programmatic Access Library for privacy-first programmatic advertising',
    'PAL (legacy)': 'Legacy version of Programmatic Access Library',
    PAI: 'Publisher Authenticated Inventory for server-side requests',
    'PAI + PAL': 'Combined PAI and PAL for server-side tags',
    Standard: 'Standard VAST tags or client-side PAI requests',
    Unknown: 'Tag type could not be automatically detected',
  };
  return tooltips[tagType] || tagType;
};

/**
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
  additionalOptions,
}) => {
  return (
    <>
      <FormControl component="fieldset" className={styles.fieldsetBorder}>
        <FormLabel component="legend" className={styles.fieldsetLabel}>
          Tag Type
        </FormLabel>
        <Box className={styles.formContentBox}>
          {showWarning && (
            <Tooltip title="Manually selected tag type does not match the automatically detected tag type.">
              <IconButton aria-label="warning" color="warning">
                <WarningIcon />
              </IconButton>
            </Tooltip>
          )}

          <RadioGroup
            aria-label="vast-tag-type"
            className={`vast-tag-type-radio-group ${styles.radioGroupContainer}`}
            name="vastTagType"
            value={selectedTagType}
            onChange={onTagTypeChange}
            row
          >
            {Object.values(tagTypes)
              .filter(
                (type) =>
                  type !== tagTypes.UNKNOWN ||
                  selectedTagType === tagTypes.UNKNOWN,
              )
              .map((type) => (
                <Tooltip
                  key={type}
                  title={getTagTypeTooltip(type)}
                  arrow
                  placement="top"
                >
                  <FormControlLabel
                    value={type}
                    control={<Radio />}
                    label={type
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  />
                </Tooltip>
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

          {additionalOptions && (
            <Box className={styles.additionalOptionsContainer}>
              {additionalOptions}
            </Box>
          )}

          <TagTypeInfo selectedTagType={selectedTagType} />
        </Box>
      </FormControl>
    </>
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
  additionalOptions: PropTypes.node,
};

TagTypeSelector.defaultProps = {
  showWarning: false,
  detectedTagType: '',
  additionalOptions: null,
};

export default TagTypeSelector;
