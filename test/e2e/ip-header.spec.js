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
 * @fileoverview E2E tests for IP Header feature
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { test, expect } from '@playwright/test';

test.describe('IP Header Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Completely disable tour before any navigation
    await page.addInitScript(() => {
      // Set multiple localStorage keys to ensure tour is completely disabled
      localStorage.setItem('vast-inspector-tour-seen', '1');
      localStorage.setItem('tourCompleted', 'true');
      localStorage.setItem('tourFinished', 'true');
      localStorage.setItem('tourSkipped', 'true');
      localStorage.setItem('disableTour', 'true');
      localStorage.setItem(
        'react-joyride:state',
        '{"run":false,"stepIndex":0}',
      );

      // Override tour callback to prevent any tour activation
      window.__disableTour = true;
    });

    await page.goto('/');

    // Wait for the page to be completely loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');

    // Force remove any tour elements that might have been created
    await page.evaluate(() => {
      // Remove all possible tour-related elements
      const selectors = [
        '[id*="react-joyride"]',
        '.react-joyride__overlay',
        '.react-joyride__spotlight',
        '.react-joyride__tooltip',
        '.react-joyride__beacon',
        '.react-joyride__portal',
      ];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          el.remove();
          // Also remove from parent if it's a portal
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      });

      // Also check document.body for any leftover tour elements
      const bodyChildren = Array.from(document.body.children);
      bodyChildren.forEach((child) => {
        if (child.id && child.id.includes('react-joyride')) {
          child.remove();
        }
        if (
          child.className &&
          typeof child.className === 'string' &&
          child.className.includes('react-joyride')
        ) {
          child.remove();
        }
      });
    });

    // Wait a bit more to ensure everything is settled
    await page.waitForTimeout(2000);
  });

  test('should show IP checkbox only for PAI tag types', async ({ page }) => {
    // Wait for the page to be stable before proceeding
    await page.waitForTimeout(1000);

    // Select PAI tag type - wait for the element to be ready
    const paiRadio = page.locator(
      '.vast-tag-type-radio-group input[value="PAI"]',
    );
    await paiRadio.waitFor({ state: 'visible', timeout: 10000 });
    await paiRadio.check();

    // Load example URL
    const loadButton = page
      .locator('button')
      .filter({ hasText: 'Load Example' });
    await loadButton.waitFor({ state: 'visible', timeout: 10000 });
    const isDisabled = await loadButton.getAttribute('disabled');
    if (isDisabled === null) {
      await loadButton.click();
    }

    // Wait for any loading to complete
    await page.waitForTimeout(1000);

    // Should show checkbox for PAI (it should be visible now since we have a PAI tag type selected)
    await expect(
      page.locator('text=IP address is passed via HTTP header'),
    ).toBeVisible({ timeout: 10000 });

    // Change to Standard tag type
    const standardRadio = page.locator(
      '.vast-tag-type-radio-group input[value="Standard"]',
    );
    await standardRadio.waitFor({ state: 'visible', timeout: 5000 });
    await standardRadio.check();

    // Wait for UI to update
    await page.waitForTimeout(500);

    // Checkbox should disappear
    await expect(
      page.locator('text=IP address is passed via HTTP header'),
    ).not.toBeVisible({ timeout: 5000 });
  });
});
