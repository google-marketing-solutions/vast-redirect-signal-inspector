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
 * @fileoverview Tag type information component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InfoIcon from '@mui/icons-material/Info';

import { TAG_TYPE } from '../../constants';
import * as styles from './style.module.css';

/**
 * Tag type information configurations
 */
const TAG_TYPE_INFO = {
  [TAG_TYPE.IMA_SDK]: {
    description:
      'Interactive Media Ads (IMA) SDK - Client-side video ad serving solution',
    link: 'https://developers.google.com/interactive-media-ads',
    linkText: 'More information...',
  },
  [TAG_TYPE.PAL]: {
    description:
      'Programmatic Access Library (PAL) SDK - Privacy-first programmatic solution',
    link: 'https://developers.google.com/ad-manager/pal',
    linkText: 'More information...',
  },
  [TAG_TYPE.PAL_LEGACY]: {
    description: 'PAL (Legacy) - Note that this is a legacy PAL implementation',
    link: null,
    linkText: null,
  },
  [TAG_TYPE.PAI]: {
    description:
      'Publisher Authenticated Inventory (PAI) - Server-side PAI requests only',
    link: null,
    linkText: null,
  },
  [TAG_TYPE.PAI_PAL]: {
    description:
      'PAI + PAL combination - Server-side tags combining PAI and PAL',
    link: null,
    linkText: null,
  },
  [TAG_TYPE.STANDARD]: {
    description: 'Standard tags or client-side PAI requests',
    link: null,
    linkText: null,
  },
  [TAG_TYPE.UNKNOWN]: {
    description: 'Unknown tag type - Unable to automatically detect tag type',
    link: null,
    linkText: null,
  },
};

/**
 * @return {JSX.Element} The TagTypeInfo component
 */
const TagTypeInfo = ({ selectedTagType }) => {
  const info = TAG_TYPE_INFO[selectedTagType];

  if (!info) {
    return null;
  }

  return (
    <Box className={styles.tagTypeInfo}>
      <Box className={styles.tagTypeInfoContent}>
        <InfoIcon className={styles.tagTypeInfoIcon} fontSize="small" />
        <Typography variant="body2" className={styles.tagTypeInfoText}>
          {info.description}
          {info.link && (
            <>
              {' '}
              <Link
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tagTypeInfoLink}
              >
                ({info.linkText})
              </Link>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

TagTypeInfo.propTypes = {
  selectedTagType: PropTypes.string.isRequired,
};

export default TagTypeInfo;
