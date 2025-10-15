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
 * @fileoverview Handles URL validation, parsing, analysis, and VAST response fetching.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import VastURLValidator from '../components/Validator/VastURLValidator';
import VastURLParser from '../components/Parser/VastURLParser';
import VastURLAnalyzer from '../components/Analyzer/VastURLAnalyzer';
import VastResponseHandler from './VastResponseHandler';
import { TEST_PARAMETER } from '../constants';

const vastResponseCache = new Map();
const pendingRequests = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const generateCorrelator = () => {
  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return Date.now().toString() + randomSuffix;
};

const normalizeUrlForCaching = (url) => {
  const urlObj = new URL(url);
  // Remove dynamic parameters that shouldn't affect caching
  urlObj.searchParams.delete('correlator');
  urlObj.searchParams.delete('_');
  urlObj.searchParams.delete('timestamp');
  return urlObj.toString();
};

const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

const isInCooldownPeriod = (cacheEntry) => {
  const COOLDOWN_DURATION = 15 * 1000;
  return cacheEntry && Date.now() - cacheEntry.timestamp < COOLDOWN_DURATION;
};

/**
 * @param {string} url - The URL to fetch the VAST response from
 * @param {boolean} forceRefresh - Force refresh bypassing cache
 * @return {Promise<VastResponseHandler|null>} The VAST response handler or null if failed
 */
const fetchVastResponse = async (url, forceRefresh = false) => {
  const cacheKey = normalizeUrlForCaching(url);

  if (!forceRefresh) {
    const cachedResponse = vastResponseCache.get(cacheKey);
    if (isCacheValid(cachedResponse)) {
      console.log('Returning cached VAST response for:', cacheKey);
      const cachedHandler = new VastResponseHandler(
        cachedResponse.data,
        true,
        cachedResponse.timestamp,
      );
      return cachedHandler;
    }
  } else {
    const cachedResponse = vastResponseCache.get(cacheKey);
    if (isInCooldownPeriod(cachedResponse)) {
      console.log(
        'Force refresh blocked due to cooldown period for:',
        cacheKey,
      );
      const cachedHandler = new VastResponseHandler(
        cachedResponse.data,
        true,
        cachedResponse.timestamp,
      );
      return cachedHandler;
    }
    console.log('Force refresh requested, bypassing cache for:', cacheKey);
  }

  // Check if there's already a pending request for this URL
  if (pendingRequests.has(cacheKey)) {
    console.log('Waiting for pending VAST request for:', cacheKey);
    return pendingRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(TEST_PARAMETER.NAME, TEST_PARAMETER.VALUE);
      urlObj.searchParams.set('correlator', generateCorrelator());
      const testUrl = urlObj.toString();
      console.log(
        'Fetching fresh VAST response from Google Ad Manager URL:',
        testUrl,
      );
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/xml, text/xml, */*',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        console.warn(
          'Failed to fetch VAST response:',
          response.status,
          response.statusText,
        );
        return null;
      }

      // Validate that we got actual content
      const vastXml = await response.text();
      if (!vastXml || vastXml.trim().length === 0) {
        console.warn('Empty VAST response received');
        return null;
      }

      console.log('Successfully fetched VAST response');

      const timestamp = Date.now();

      const vastResponseHandler = new VastResponseHandler(
        vastXml,
        false,
        timestamp,
      );

      const cacheEntry = {
        data: vastXml,
        timestamp,
        handler: vastResponseHandler,
      };
      vastResponseCache.set(cacheKey, cacheEntry);
      return vastResponseHandler;
    } catch (error) {
      console.error('Error fetching VAST response:', error);
      return null;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  // Store the promise to prevent duplicate requests
  pendingRequests.set(cacheKey, fetchPromise);

  return fetchPromise;
};

export const clearVastResponseCache = () => {
  vastResponseCache.clear();
  pendingRequests.clear();
  console.log('VAST response cache cleared');
};

/**
 * @return {Object} Cache statistics
 */
export const getCacheStats = () => {
  const now = Date.now();
  const validEntries = Array.from(vastResponseCache.values()).filter(
    (entry) => now - entry.timestamp < CACHE_DURATION,
  );

  return {
    totalEntries: vastResponseCache.size,
    validEntries: validEntries.length,
    pendingRequests: pendingRequests.size,
    cacheDurationMs: CACHE_DURATION,
  };
};

/**
 * @param {string} url - The URL to check
 * @return {Object} Cooldown status
 */
export const getCooldownStatus = (url) => {
  const cacheKey = normalizeUrlForCaching(url);
  const cachedResponse = vastResponseCache.get(cacheKey);

  if (!cachedResponse) {
    return { inCooldown: false, remainingTime: 0 };
  }

  const COOLDOWN_DURATION = 15 * 1000; // 15 seconds
  const timeSinceCache = Date.now() - cachedResponse.timestamp;
  const inCooldown = timeSinceCache < COOLDOWN_DURATION;
  const remainingTime = inCooldown
    ? Math.ceil((COOLDOWN_DURATION - timeSinceCache) / 1000)
    : 0;

  return { inCooldown, remainingTime, cacheAge: timeSinceCache };
};

/**
 * @param {string} url - The URL to validate
 * @return {Object} Validation result with success status and detected tag type
 */
export const validateUrl = (url) => {
  const validator = new VastURLValidator(url);
  return validator.validate();
};

/**
 * @param {string} url - The URL to analyze
 * @param {string} tagType - The selected tag type for analysis
 * @param {string} implementationType - The selected implementation type (web, mobile, etc.)
 * @param {boolean} forceRefresh - Force refresh VAST response bypassing cache
 * @param {Object} options - Additional analysis options
 * @param {boolean} options.ipViaHttpHeader - IP address is passed via HTTP header
 * @return {Promise<Object>} Analysis result with parameters and validation scores
 */
export const analyzeUrl = async (
  url,
  tagType,
  implementationType,
  forceRefresh = false,
  options = {},
) => {
  const result = {
    success: false,
    error: null,
    vastParameters: {},
    analysisResult: {},
  };

  const parser = new VastURLParser(url);
  const parseResult = parser.parse();
  if (!parseResult.success) {
    result.error = parseResult.error;
    return result;
  }
  result.vastParameters = parseResult.params;

  const analyzer = new VastURLAnalyzer(
    url,
    parseResult.params,
    tagType,
    implementationType,
    options,
  );

  const analyzerResult = analyzer.analyze();
  if (!analyzerResult.success) {
    result.error = analyzerResult.error;
    return result;
  }

  try {
    const cacheKey = normalizeUrlForCaching(url);
    const cachedResponse = vastResponseCache.get(cacheKey);
    const shouldRespectCooldown =
      !forceRefresh && isInCooldownPeriod(cachedResponse);
    const finalForceRefresh = forceRefresh && !shouldRespectCooldown;
    const vastResponseHandler = await fetchVastResponse(url, finalForceRefresh);
    if (vastResponseHandler) {
      analyzerResult.analysisResult.vastResponse = vastResponseHandler;
    }
  } catch (error) {
    console.warn('Failed to fetch VAST response:', error);
  }

  result.analysisResult = analyzerResult.analysisResult;
  result.success = true;
  return result;
};

// Expose cache functions to window for debugging
if (typeof window !== 'undefined') {
  window.vastResponseCache = {
    clear: clearVastResponseCache,
    stats: getCacheStats,
    getAll: () => Array.from(vastResponseCache.entries()),
  };
}
