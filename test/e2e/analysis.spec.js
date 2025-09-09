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
 * @fileoverview E2E tests for VAST URL analysis results
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { test, expect } from '@playwright/test';

const testCombinations = [
  {
    tagType: 'Standard',
    tagValue: 'Standard',
    implementationType: 'Web',
    implementationValue: 'web',
  },
  {
    tagType: 'Standard',
    tagValue: 'Standard',
    implementationType: 'Mobile App',
    implementationValue: 'mobileApp',
  },
  {
    tagType: 'Standard',
    tagValue: 'Standard',
    implementationType: 'Connected TV',
    implementationValue: 'connectedTV',
  },
  {
    tagType: 'PAL',
    tagValue: 'PAL',
    implementationType: 'Web',
    implementationValue: 'web',
  },
  {
    tagType: 'PAL',
    tagValue: 'PAL',
    implementationType: 'Mobile App',
    implementationValue: 'mobileApp',
  },
  {
    tagType: 'PAL',
    tagValue: 'PAL',
    implementationType: 'Connected TV',
    implementationValue: 'connectedTV',
  },
  {
    tagType: 'PAL (legacy)',
    tagValue: 'PAL (legacy)',
    implementationType: 'Web',
    implementationValue: 'web',
  },
  {
    tagType: 'PAL (legacy)',
    tagValue: 'PAL (legacy)',
    implementationType: 'Mobile App',
    implementationValue: 'mobileApp',
  },
  {
    tagType: 'PAL (legacy)',
    tagValue: 'PAL (legacy)',
    implementationType: 'Connected TV',
    implementationValue: 'connectedTV',
  },
  {
    tagType: 'PAI',
    tagValue: 'PAI',
    implementationType: 'Web',
    implementationValue: 'web',
  },
  {
    tagType: 'PAI',
    tagValue: 'PAI',
    implementationType: 'Mobile App',
    implementationValue: 'mobileApp',
  },
  {
    tagType: 'PAI',
    tagValue: 'PAI',
    implementationType: 'Connected TV',
    implementationValue: 'connectedTV',
  },
  {
    tagType: 'IMA SDK',
    tagValue: 'IMA SDK',
    implementationType: 'Web',
    implementationValue: 'web',
  },
  {
    tagType: 'IMA SDK',
    tagValue: 'IMA SDK',
    implementationType: 'Mobile App',
    implementationValue: 'mobileApp',
  },
  {
    tagType: 'IMA SDK',
    tagValue: 'IMA SDK',
    implementationType: 'Connected TV',
    implementationValue: 'connectedTV',
  },
];

test.describe('VAST URL Analysis', () => {
  testCombinations.forEach(
    ({ tagType, tagValue, implementationType, implementationValue }) => {
      test(`should analyze ${tagType} with ${implementationType} implementation`, async ({
        page,
      }) => {
        await page.goto('/');

        await page.evaluate(() => {
          localStorage.setItem('tourCompleted', 'true');
          localStorage.setItem('tourFinished', 'true');
          localStorage.setItem('tourSkipped', 'true');
          localStorage.setItem('disableTour', 'true');
          localStorage.setItem(
            'react-joyride:state',
            '{"run":false,"stepIndex":0}',
          );
        });

        await page.reload();
        await page.waitForTimeout(1000);
        await page.evaluate(() => {
          const tourElements = document.querySelectorAll(
            '[id*="react-joyride"], .react-joyride__overlay, .react-joyride__spotlight',
          );
          tourElements.forEach((el) => el.remove());
        });

        await page
          .locator(`.vast-tag-type-radio-group input[value="${tagValue}"]`)
          .check();

        await page
          .locator('button')
          .filter({ hasText: 'Load Example' })
          .waitFor({ state: 'visible' });
        const loadButton = page
          .locator('button')
          .filter({ hasText: 'Load Example' });

        const isDisabled = await loadButton.getAttribute('disabled');
        if (isDisabled === null) {
          await loadButton.click();
        }

        await page
          .locator(
            `.implementation-type-radio-group input[value="${implementationValue}"]`,
          )
          .check();

        await page.locator('.analyze-button').click();

        await expect(page.locator('.vast-url-score-result')).toBeVisible({
          timeout: 10000,
        });

        const sections = [
          {
            selector: '.vast-url-parameters-required-parameters',
            name: 'Required Parameters',
          },
          {
            selector: '.vast-url-parameters-required-programmatic-parameters',
            name: 'Required Programmatic Parameters',
          },
          {
            selector:
              '.vast-url-parameters-recommended-programmatic-parameters',
            name: 'Recommended Programmatic Parameters',
          },
        ];

        for (const section of sections) {
          const sectionElement = page.locator(section.selector);
          const count = await sectionElement.count();
          if (count > 0) {
            await expect(sectionElement).toBeVisible();
            console.log(`✅ ${section.name} section is visible`);
            const tableRows = page.locator(
              `${section.selector} table tbody tr`,
            );
            const rowCount = await tableRows.count();
            expect(rowCount).toBeGreaterThan(0);
            console.log(`✅ ${section.name} has ${rowCount} parameter rows`);
          } else {
            console.log(
              `ℹ️ ${section.name} section not present for this combination`,
            );
          }
        }

        await expect(page.locator('.vast-url-score-result')).toBeVisible();
      });
    },
  );
});
