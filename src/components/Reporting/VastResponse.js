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
 * @fileoverview VAST Response Display Component
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled } from '@mui/material/styles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const StyledTableContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
  width: '100%',
  overflowX: 'auto',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const FloatingCopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(3),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[4],
  },
  '&.copying': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
}));

/**
 * @param {Object} props - Component props
 * @param {Object} props.vastResponse - VAST response handler or raw response
 * @param {Function} props.onRefresh - Callback for refresh button
 * @return {React.ReactNode} The component
 */
const VastResponse = ({ vastResponse, onRefresh }) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copySuccess, setCopySuccess] = useState(false);
  const REFRESH_COOLDOWN_MS = 15000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!vastResponse) return null;

  const isHandler =
    vastResponse && typeof vastResponse.getSummary === 'function';
  const cacheInfo = isHandler ? vastResponse.getCacheInfo() : null;
  const summary = isHandler ? vastResponse.getSummary() : null;
  const formattedXml = isHandler ? vastResponse.rawXml : vastResponse;

  const getLanguage = () => {
    if (typeof formattedXml === 'object') {
      return 'javascript';
    }

    const content = formattedXml || '';

    if (
      content.includes('<?xml') ||
      content.includes('<VAST') ||
      content.includes('</')
    ) {
      return 'xml';
    }

    if (content.includes('{') && content.includes('}')) {
      return 'javascript';
    }

    return 'text';
  };

  const getRefreshStatus = () => {
    let referenceTime = 0;

    if (isHandler && vastResponse.cacheTimestamp) {
      referenceTime = vastResponse.cacheTimestamp;
    } else if (lastRefreshTime > 0) {
      referenceTime = lastRefreshTime;
    }

    const timeSinceReference = currentTime - referenceTime;

    if (referenceTime > 0 && timeSinceReference >= REFRESH_COOLDOWN_MS) {
      return { isDisabled: false, remainingTime: 0 };
    }

    const isDisabled =
      referenceTime > 0 && timeSinceReference < REFRESH_COOLDOWN_MS;
    const remainingTime = isDisabled
      ? Math.ceil((REFRESH_COOLDOWN_MS - timeSinceReference) / 1000)
      : 0;

    return { isDisabled, remainingTime };
  };

  const refreshStatus = getRefreshStatus();
  const isRefreshDisabled = refreshStatus.isDisabled;
  const remainingSeconds = refreshStatus.remainingTime;

  const handleRefreshClick = () => {
    if (isRefreshDisabled) {
      return;
    }

    setLastRefreshTime(Date.now());
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleCopyClick = async () => {
    try {
      const textToCopy =
        typeof formattedXml === 'object'
          ? JSON.stringify(formattedXml, null, 2)
          : formattedXml || '';

      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderChip = (condition, label, props = {}) => {
    if (!condition) return null;
    return <Chip label={label} size="small" {...props} />;
  };

  return (
    <div
      id="vast-response"
      style={{ marginBottom: '20px', scrollMarginTop: '100px' }}
      className="vast-url-parameters vast-url-parameters-vast-response"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography
          variant="h6"
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              fontSize: '1rem',
              scrollMarginTop: '80px',
            },
            [theme.breakpoints.up('sm')]: {
              scrollMarginTop: '100px',
            },
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          })}
        >
          <CodeIcon />
          VAST Response
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {cacheInfo && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Chip
                label={
                  cacheInfo.isFromCache
                    ? `Cached (${cacheInfo.ageDisplay})`
                    : cacheInfo.fetchedAt
                }
                size="small"
                color={cacheInfo.isFromCache ? 'info' : 'success'}
                variant="outlined"
                title={cacheInfo.fullTimestamp}
              />
            </Box>
          )}
          {onRefresh && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshClick}
              disabled={isRefreshDisabled}
              title={
                isRefreshDisabled
                  ? `Please wait ${remainingSeconds} seconds before refreshing again`
                  : 'Refresh VAST response (bypass cache) - 15 second cooldown from cache creation'
              }
            >
              {isRefreshDisabled ? `Wait ${remainingSeconds}s` : 'Refresh'}
            </Button>
          )}
        </Box>
      </Box>

      {summary && (
        <Box mb={2}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              VAST Summary
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={`Version: ${summary.version || 'Unknown'}`}
                size="small"
              />
              <Chip
                label={`Ads: ${summary.adCount}`}
                size="small"
                color={summary.adCount > 0 ? 'success' : 'error'}
              />
              <Chip
                label={`Creatives: ${summary.creativeCount}`}
                size="small"
              />
              <Chip
                label={`Impressions: ${summary.impressionCount}`}
                size="small"
              />

              {renderChip(
                summary.companionAdCount > 0,
                `Companions: ${summary.companionAdCount}`,
                { color: 'primary' },
              )}
              {renderChip(
                summary.iconCount > 0,
                `Icons: ${summary.iconCount}`,
                { color: 'secondary' },
              )}
              {renderChip(
                summary.iconPrograms?.length > 0,
                `Programs: ${summary.iconPrograms.join(', ')}`,
                { color: 'secondary', variant: 'outlined' },
              )}
              {renderChip(
                summary.adVerificationCount > 0,
                `Ad Verifications: ${summary.adVerificationCount}`,
                { color: 'info' },
              )}
              {renderChip(summary.hasOMID, 'OMID', {
                color: 'success',
                variant: 'filled',
              })}
              {renderChip(
                summary.mediaFileCount > 0,
                `Media Files: ${summary.mediaFileCount}`,
              )}
              {renderChip(
                summary.mediaTypes?.length > 0,
                `Types: ${summary.mediaTypes.join(', ')}`,
                { variant: 'outlined' },
              )}
              {renderChip(
                summary.clickThroughCount > 0,
                `Click Through: ${summary.clickThroughCount}`,
                { color: 'primary', variant: 'outlined' },
              )}
              {renderChip(
                summary.clickTrackingCount > 0,
                `Click Tracking: ${summary.clickTrackingCount}`,
                { color: 'primary', variant: 'outlined' },
              )}
              {renderChip(
                summary.trackingEventTypes > 0,
                `Event Types: ${summary.trackingEventTypes}`,
              )}
              {renderChip(
                summary.validationErrors?.length > 0,
                `Errors: ${summary.validationErrors.length}`,
                { color: 'error' },
              )}
              {renderChip(
                summary.validationWarnings?.length > 0,
                `Warnings: ${summary.validationWarnings.length}`,
                { color: 'warning' },
              )}
            </Box>
          </Paper>
        </Box>
      )}

      <StyledTableContainer component={Paper}>
        <Tooltip title="Copy VAST response to clipboard">
          <FloatingCopyButton
            size="small"
            onClick={handleCopyClick}
            className={copySuccess ? 'copying' : ''}
          >
            <ContentCopyIcon fontSize="small" />
          </FloatingCopyButton>
        </Tooltip>
        <SyntaxHighlighter
          language={getLanguage()}
          style={oneLight}
          customStyle={{
            margin: 0,
            maxHeight: '500px',
            fontSize: '13px',
            lineHeight: '1.4',
            borderRadius: '8px',
            border: '1px solid #e1e4e8',
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#959da5',
            borderRight: '1px solid #e1e4e8',
            backgroundColor: '#f6f8fa',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {typeof formattedXml === 'object'
            ? JSON.stringify(formattedXml, null, 2)
            : formattedXml || ''}
        </SyntaxHighlighter>
      </StyledTableContainer>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          VAST response copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

VastResponse.propTypes = {
  vastResponse: PropTypes.object,
  onRefresh: PropTypes.func,
};

VastResponse.defaultProps = {
  vastResponse: null,
  onRefresh: null,
};

export default VastResponse;
