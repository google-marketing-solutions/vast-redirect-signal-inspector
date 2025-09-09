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
 * @fileoverview E2E test for the VAST URL Inspector Tour functionality
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { test, expect } from '@playwright/test';

test.describe('VAST URL Inspector Tour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('should complete the full tour successfully', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=VAST Signal Inspector')).toBeVisible();

    const tourTooltip = page.locator('.react-joyride__tooltip');
    const isAutoStarted = await tourTooltip.isVisible();

    if (!isAutoStarted) {
      const tourButton = page.locator('button:has-text("Tour")');
      await expect(tourButton).toBeVisible();
      await tourButton.click();

      await expect(tourTooltip).toBeVisible({ timeout: 10000 });
    }

    let stepCount = 0;
    const maxSteps = 15;

    while (stepCount < maxSteps) {
      try {
        await expect(tourTooltip).toBeVisible();

        const stepContent = await tourTooltip.textContent();
        console.log(
          `Tour Step ${stepCount + 1}: ${stepContent?.substring(0, 100)}...`,
        );

        const joyrideButtons = page.locator('.react-joyride__tooltip button');
        const buttonCount = await joyrideButtons.count();

        let primaryButton = null;

        for (let i = 0; i < buttonCount; i++) {
          const button = joyrideButtons.nth(i);
          const buttonText = await button.textContent();

          if (
            buttonText?.match(/close|finish|done|fertig|beenden|schließen/i)
          ) {
            console.log('Found finish button, completing tour');
            await button.click();
            stepCount = maxSteps;
            break;
          }

          if (buttonText?.match(/next|weiter|step \d+/i)) {
            primaryButton = button;
          }
        }

        if (stepCount >= maxSteps) break;

        if (primaryButton) {
          await primaryButton.click();
          await page.waitForTimeout(1000);
          stepCount++;
        } else {
          if (buttonCount > 0) {
            await joyrideButtons.nth(buttonCount - 1).click();
            await page.waitForTimeout(1000);
            stepCount++;
          } else {
            console.log('No buttons found, exiting tour');
            break;
          }
        }

        if (stepContent?.toLowerCase().includes('analyz')) {
          await page.waitForTimeout(3000);
        }
      } catch (error) {
        console.log(`Error in step ${stepCount + 1}:`, error.message);
        break;
      }
    }

    console.log(`Tour completed after ${stepCount} steps`);

    await expect(tourTooltip).not.toBeVisible({ timeout: 10000 });

    const tourCompleted = await page.evaluate(() => {
      return localStorage.getItem('vast-inspector-tour-seen') === '1';
    });
    expect(tourCompleted).toBe(true);

    await expect(page.locator('.vast-redirect-url-input')).toBeVisible();

    console.log('Tour test completed successfully!');
  });

  test('should allow skipping the tour', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const tourTooltip = page.locator('.react-joyride__tooltip');
    const isAutoStarted = await tourTooltip.isVisible();

    if (!isAutoStarted) {
      const tourButton = page.locator('button:has-text("Tour")');
      await tourButton.click();
      await expect(tourTooltip).toBeVisible({ timeout: 10000 });
    }

    const skipButton = page.locator('.react-joyride__tooltip button').filter({
      hasText: /skip|überspringen/i,
    });

    if (await skipButton.isVisible()) {
      await skipButton.click();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(tourTooltip).not.toBeVisible({ timeout: 5000 });

    const tourCompleted = await page.evaluate(() => {
      return localStorage.getItem('vast-inspector-tour-seen') === '1';
    });
    expect(tourCompleted).toBe(true);
  });

  test('should not auto-start tour if already completed', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('vast-inspector-tour-seen', '1');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const tourButton = page.locator('button:has-text("Tour")');
    await expect(tourButton).toBeVisible();

    await expect(page.locator('.react-joyride__tooltip')).not.toBeVisible({
      timeout: 2000,
    });
  });

  test('should handle tour restart', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('vast-inspector-tour-seen', '1');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tourButton = page.locator('button:has-text("Tour")');
    await tourButton.click();

    await expect(page.locator('.react-joyride__tooltip')).toBeVisible({
      timeout: 10000,
    });
  });
});
