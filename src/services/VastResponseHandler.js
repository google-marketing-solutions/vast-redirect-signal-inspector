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
 * @fileoverview VAST Response handler class for parsing and analyzing VAST XML responses.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Class to handle VAST XML response parsing, validation, and analysis
 */
class VastResponseHandler {
  /**
   * @param {string} vastXml - The VAST XML response string
   * @param {boolean} isFromCache - Whether this response came from cache
   * @param {number} cacheTimestamp - Timestamp when response was cached
   */
  constructor(vastXml, isFromCache = false, cacheTimestamp = null) {
    this.rawXml = vastXml;
    this.isFromCache = isFromCache;
    this.cacheTimestamp = cacheTimestamp;
    this.parsedData = null;
    this.validationErrors = [];
    this.analysisResults = {};

    if (vastXml) {
      this.parseXml();
    }
  }

  /**
   * Parses the VAST XML and extracts basic structure information
   */
  parseXml() {
    try {
      // Basic XML parsing to extract key information
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.rawXml, 'text/xml');

      // Check for parsing errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        this.validationErrors.push('Invalid XML structure');
        return;
      }

      const vastElement = doc.querySelector('VAST');
      if (!vastElement) {
        this.validationErrors.push('No VAST element found');
        return;
      }

      this.parsedData = {
        version: vastElement.getAttribute('version'),
        ads: this.extractAds(doc),
        errors: this.extractErrors(doc),
        impressions: this.extractImpressions(doc),
        trackingEvents: this.extractTrackingEvents(doc),
        companionAds: this.extractCompanionAds(doc),
        adVerifications: this.extractAdVerifications(doc),
        icons: this.extractIcons(doc),
        mediaFiles: this.extractMediaFiles(doc),
        clickTracking: this.extractClickTracking(doc),
      };
    } catch (error) {
      this.validationErrors.push(`XML parsing error: ${error.message}`);
    }
  }

  /**
   * Extracts ad information from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of ad objects
   */
  extractAds(doc) {
    const ads = [];
    const adElements = doc.querySelectorAll('Ad');

    adElements.forEach((ad, index) => {
      const adData = {
        id: ad.getAttribute('id') || `ad-${index}`,
        sequence: ad.getAttribute('sequence'),
        type: ad.querySelector('InLine')
          ? 'InLine'
          : ad.querySelector('Wrapper')
            ? 'Wrapper'
            : 'Unknown',
      };

      // Extract creative information
      const creatives = ad.querySelectorAll('Creative');
      adData.creatives = Array.from(creatives).map((creative) => ({
        id: creative.getAttribute('id'),
        sequence: creative.getAttribute('sequence'),
        type: creative.querySelector('Linear')
          ? 'Linear'
          : creative.querySelector('NonLinearAds')
            ? 'NonLinear'
            : creative.querySelector('CompanionAds')
              ? 'Companion'
              : 'Unknown',
      }));

      ads.push(adData);
    });

    return ads;
  }

  /**
   * Extracts error URLs from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of error URLs
   */
  extractErrors(doc) {
    const errorElements = doc.querySelectorAll('Error');
    return Array.from(errorElements).map((error) => error.textContent.trim());
  }

  /**
   * Extracts impression URLs from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of impression URLs
   */
  extractImpressions(doc) {
    const impressionElements = doc.querySelectorAll('Impression');
    return Array.from(impressionElements).map((impression) =>
      impression.textContent.trim(),
    );
  }

  /**
   * Extracts tracking events from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Object} Object with tracking events grouped by type
   */
  extractTrackingEvents(doc) {
    const trackingEvents = {};
    const trackingElements = doc.querySelectorAll('Tracking');

    trackingElements.forEach((tracking) => {
      const eventType = tracking.getAttribute('event');
      if (eventType) {
        if (!trackingEvents[eventType]) {
          trackingEvents[eventType] = [];
        }
        trackingEvents[eventType].push(tracking.textContent.trim());
      }
    });

    return trackingEvents;
  }

  /**
   * Extracts companion ads from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of companion ad objects
   */
  extractCompanionAds(doc) {
    const companions = [];
    const companionElements = doc.querySelectorAll('Companion');

    companionElements.forEach((companion) => {
      companions.push({
        id: companion.getAttribute('id'),
        width: companion.getAttribute('width'),
        height: companion.getAttribute('height'),
        resourceType: companion.querySelector('StaticResource')
          ? 'StaticResource'
          : companion.querySelector('IFrameResource')
            ? 'IFrameResource'
            : companion.querySelector('HTMLResource')
              ? 'HTMLResource'
              : 'Unknown',
        clickThrough:
          companion
            .querySelector('CompanionClickThrough')
            ?.textContent?.trim() || null,
      });
    });

    return companions;
  }

  /**
   * Extracts ad verification elements (OMID, etc.) from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of ad verification objects
   */
  extractAdVerifications(doc) {
    const verifications = [];
    const verificationElements = doc.querySelectorAll(
      'AdVerifications Verification',
    );

    verificationElements.forEach((verification) => {
      const vendorKey = verification.getAttribute('vendor');
      const jsResource = verification.querySelector('JavaScriptResource');
      const verificationParameters = verification.querySelector(
        'VerificationParameters',
      );

      verifications.push({
        vendor: vendorKey,
        jsResourceUrl: jsResource?.textContent?.trim() || null,
        apiFramework: jsResource?.getAttribute('apiFramework') || null,
        parameters: verificationParameters?.textContent?.trim() || null,
        browserOptional: jsResource?.getAttribute('browserOptional') === 'true',
      });
    });

    return verifications;
  }

  /**
   * Extracts icon elements from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of icon objects
   */
  extractIcons(doc) {
    const icons = [];
    const iconElements = doc.querySelectorAll('Icons Icon');

    iconElements.forEach((icon) => {
      icons.push({
        program: icon.getAttribute('program'),
        width: icon.getAttribute('width'),
        height: icon.getAttribute('height'),
        xPosition: icon.getAttribute('xPosition'),
        yPosition: icon.getAttribute('yPosition'),
        duration: icon.getAttribute('duration'),
        offset: icon.getAttribute('offset'),
        apiFramework: icon.getAttribute('apiFramework'),
        resourceType: icon.querySelector('StaticResource')
          ? 'StaticResource'
          : icon.querySelector('IFrameResource')
            ? 'IFrameResource'
            : icon.querySelector('HTMLResource')
              ? 'HTMLResource'
              : 'Unknown',
        clickThrough:
          icon.querySelector('IconClickThrough')?.textContent?.trim() || null,
      });
    });

    return icons;
  }

  /**
   * Extracts media files from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Array} Array of media file objects
   */
  extractMediaFiles(doc) {
    const mediaFiles = [];
    const mediaFileElements = doc.querySelectorAll('MediaFile');

    mediaFileElements.forEach((mediaFile) => {
      mediaFiles.push({
        id: mediaFile.getAttribute('id'),
        delivery: mediaFile.getAttribute('delivery'),
        type: mediaFile.getAttribute('type'),
        width: mediaFile.getAttribute('width'),
        height: mediaFile.getAttribute('height'),
        codec: mediaFile.getAttribute('codec'),
        bitrate: mediaFile.getAttribute('bitrate'),
        scalable: mediaFile.getAttribute('scalable') === 'true',
        maintainAspectRatio:
          mediaFile.getAttribute('maintainAspectRatio') === 'true',
        apiFramework: mediaFile.getAttribute('apiFramework'),
        url: mediaFile.textContent?.trim() || null,
      });
    });

    return mediaFiles;
  }

  /**
   * Extracts click tracking from VAST XML
   * @param {Document} doc - Parsed XML document
   * @return {Object} Click tracking information
   */
  extractClickTracking(doc) {
    return {
      clickThrough: Array.from(doc.querySelectorAll('ClickThrough')).map((el) =>
        el.textContent?.trim(),
      ),
      clickTracking: Array.from(doc.querySelectorAll('ClickTracking')).map(
        (el) => el.textContent?.trim(),
      ),
    };
  }

  /**
   * Validates the VAST response according to VAST standards
   * @return {Object} Validation results
   */
  validateVast() {
    const validation = {
      isValid: true,
      errors: [...this.validationErrors],
      warnings: [],
    };

    if (!this.parsedData) {
      validation.isValid = false;
      validation.errors.push('Unable to parse VAST XML');
      return validation;
    }

    // Check VAST version
    if (!this.parsedData.version) {
      validation.warnings.push('VAST version not specified');
    }

    // Check for ads
    if (!this.parsedData.ads || this.parsedData.ads.length === 0) {
      validation.isValid = false;
      validation.errors.push('No ads found in VAST response');
    }

    // Check for required elements in ads
    this.parsedData.ads.forEach((ad, index) => {
      if (!ad.creatives || ad.creatives.length === 0) {
        validation.warnings.push(`Ad ${index + 1}: No creatives found`);
      }
    });

    return validation;
  }

  /**
   * Gets cache information for display
   * @return {Object|null} Cache info or null if not from cache
   */
  getCacheInfo() {
    if (!this.isFromCache && !this.cacheTimestamp) return null;

    const now = Date.now();
    const timestamp = this.cacheTimestamp || now;
    const ageMs = now - timestamp;
    const ageSeconds = Math.floor(ageMs / 1000);
    const fetchTime = new Date(timestamp);

    return {
      isFromCache: this.isFromCache,
      ageSeconds,
      ageDisplay:
        ageSeconds < 60
          ? `${ageSeconds}s ago`
          : ageSeconds < 3600
            ? `${Math.floor(ageSeconds / 60)}m ${ageSeconds % 60}s ago`
            : `${Math.floor(ageSeconds / 3600)}h ${Math.floor((ageSeconds % 3600) / 60)}m ago`,
      timestamp: fetchTime.toLocaleTimeString(),
      fullTimestamp: fetchTime.toLocaleString(),
      fetchedAt: `Fetched at ${fetchTime.toLocaleTimeString()}`,
    };
  }

  /**
   * Gets summary statistics about the VAST response
   * @return {Object} Summary statistics
   */
  getSummary() {
    if (!this.parsedData) {
      return {
        isValid: false,
        error: 'Unable to parse VAST response',
      };
    }

    const validation = this.validateVast();

    return {
      isValid: validation.isValid,
      version: this.parsedData.version,
      adCount: this.parsedData.ads?.length || 0,
      creativeCount:
        this.parsedData.ads?.reduce(
          (sum, ad) => sum + (ad.creatives?.length || 0),
          0,
        ) || 0,
      impressionCount: this.parsedData.impressions?.length || 0,
      errorUrlCount: this.parsedData.errors?.length || 0,
      trackingEventTypes: Object.keys(this.parsedData.trackingEvents || {})
        .length,

      // New detailed information
      companionAdCount: this.parsedData.companionAds?.length || 0,
      adVerificationCount: this.parsedData.adVerifications?.length || 0,
      iconCount: this.parsedData.icons?.length || 0,
      mediaFileCount: this.parsedData.mediaFiles?.length || 0,
      clickThroughCount:
        this.parsedData.clickTracking?.clickThrough?.length || 0,
      clickTrackingCount:
        this.parsedData.clickTracking?.clickTracking?.length || 0,

      // OMID Detection
      hasOMID:
        this.parsedData.adVerifications?.some(
          (verification) =>
            verification.vendor?.toLowerCase().includes('omid') ||
            verification.jsResourceUrl?.toLowerCase().includes('omid') ||
            verification.apiFramework?.toLowerCase().includes('omid'),
        ) || false,

      // Icon types (like WTA)
      iconPrograms: [
        ...new Set(
          this.parsedData.icons?.map((icon) => icon.program).filter(Boolean) ||
            [],
        ),
      ],

      // Media file types
      mediaTypes: [
        ...new Set(
          this.parsedData.mediaFiles
            ?.map((file) => file.type)
            .filter(Boolean) || [],
        ),
      ],

      validationErrors: validation.errors,
      validationWarnings: validation.warnings,
      cacheInfo: this.getCacheInfo(),
    };
  }
}

export default VastResponseHandler;
