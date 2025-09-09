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
const CACHE_DURATION = 30 * 1000;

/**
 * Generates a fresh correlator value for ad requests
 * @return {string} A unique correlator value (numbers only)
 */
const generateCorrelator = () => {
  // Generate a random number with 6 digits to ensure uniqueness
  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return Date.now().toString() + randomSuffix;
};

/**
 * Normalizes a URL for caching by removing dynamic parameters
 * @param {string} url - The original URL
 * @return {string} Normalized URL for caching
 */
const getCacheKey = (url) => {
  const urlObj = new URL(url);
  // Remove dynamic parameters that shouldn't affect caching
  urlObj.searchParams.delete('correlator');
  urlObj.searchParams.delete('_');
  urlObj.searchParams.delete('timestamp');
  return urlObj.toString();
};

/**
 * Checks if cached response is still valid
 * @param {Object} cacheEntry - Cache entry with timestamp and data
 * @return {boolean} True if cache is still valid
 */
const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

/**
 * Checks if we should block new requests due to recent activity (10 second cooldown)
 * @param {Object} cacheEntry - Cache entry with timestamp and data
 * @return {boolean} True if still in cooldown period
 */
const isInCooldownPeriod = (cacheEntry) => {
  const COOLDOWN_DURATION = 15 * 1000; // 15 seconds
  return cacheEntry && Date.now() - cacheEntry.timestamp < COOLDOWN_DURATION;
};

/**
 * Fetches the VAST response from a validated Google Ad Manager URL.
 * @param {string} url - The URL to fetch the VAST response from
 * @param {boolean} forceRefresh - Force refresh bypassing cache
 * @return {Promise<VastResponseHandler|null>} The VAST response handler or null if failed
 */
const fetchVastResponse = async (url, forceRefresh = false) => {
  const cacheKey = getCacheKey(url);

  // Check cache first (unless force refresh is requested)
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
    console.log('Force refresh requested, bypassing cache for:', cacheKey);
  }

  // Check if there's already a pending request for this URL
  if (pendingRequests.has(cacheKey)) {
    console.log('Waiting for pending VAST request for:', cacheKey);
    return pendingRequests.get(cacheKey);
  }

  // Create the actual fetch promise
  const fetchPromise = (async () => {
    try {
      // Prepare URL with test parameters and fresh correlator
      const urlObj = new URL(url);
      urlObj.searchParams.set(TEST_PARAMETER.NAME, TEST_PARAMETER.VALUE);
      urlObj.searchParams.set('correlator', generateCorrelator());
      const testUrl = urlObj.toString();
      console.log(
        'Fetching fresh VAST response from Google Ad Manager URL:',
        testUrl,
      );

      // Fetch the VAST response
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

      const vastXml = await response.text();
      console.log('Successfully fetched VAST response');

      const timestamp = Date.now();

      // Create VastResponseHandler with cache info
      const vastResponseHandler = new VastResponseHandler(
        vastXml,
        false,
        timestamp,
      );

      // Cache the response with metadata
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

/**
 * Clears the VAST response cache
 */
export const clearVastResponseCache = () => {
  vastResponseCache.clear();
  pendingRequests.clear();
  console.log('VAST response cache cleared');
};

/**
 * Gets cache statistics for debugging
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
 * Validates a VAST URL for correctness and tag type detection.
 * @param {string} url - The URL to validate
 * @return {Object} Validation result with success status and detected tag type
 */
export const validateUrl = (url) => {
  const validator = new VastURLValidator(url);
  return validator.validate();
};

/**
 * Performs comprehensive analysis of a VAST URL including parameter extraction and validation.
 * @param {string} url - The URL to analyze
 * @param {string} tagType - The selected tag type for analysis
 * @param {string} implementationType - The selected implementation type (web, mobile, etc.)
 * @param {boolean} forceRefresh - Force refresh VAST response bypassing cache
 * @return {Promise<Object>} Analysis result with parameters and validation scores
 */
export const analyzeUrl = async (
  url,
  tagType,
  implementationType,
  forceRefresh = false,
) => {
  const result = {
    success: false,
    error: null,
    vastParameters: {},
    analysisResult: {},
  };

  // Parse URL and extract parameters
  const parser = new VastURLParser(url);
  const parseResult = parser.parse();
  if (!parseResult.success) {
    result.error = parseResult.error;
    return result;
  }
  result.vastParameters = parseResult.params;

  // Analyze Vast URL based on the parsed parameters
  const analyzer = new VastURLAnalyzer(
    url,
    parseResult.params,
    tagType,
    implementationType,
  );

  const analyzerResult = analyzer.analyze();
  if (!analyzerResult.success) {
    result.error = analyzerResult.error;
    return result;
  }

  // Fetch VAST response
  try {
    const cacheKey = getCacheKey(url);
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
