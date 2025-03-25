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

import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    '**/third_party',
    '**/coverage',
    '**/dist',
    '**/node_modules',
    '**/third_party',
    '**/*.min.js',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      // 'google', // npm package is not up to date
      'plugin:react/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:compat/recommended',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        APP_VERSION: false,
        DEVMODE: false,
        VERSION: false,
        chrome: true,
        globalThis: false,
        serviceWorkerOption: true,
        window: true,
      },

      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@mui/*/*/*'],
        },
      ],

      'no-unused-vars': [
        2,
        {
          args: 'after-used',
          argsIgnorePattern: '^opt_',
          varsIgnorePattern: '_unused$',
        },
      ],

      'no-console': 0,

      camelcase: [
        0,
        {
          properties: 'never',
        },
      ],

      'new-cap': [
        2,
        {
          newIsCapExceptions: [],
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['**/*_test.js'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
        ...globals.serviceworker,
      },
    },
  },
  {
    files: ['**/*.conf.babel.js', 'build/**/*.babel.js'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
        ...globals.serviceworker,
      },
    },
  },
  {
    files: ['build/**/*.js'],

    rules: {
      '@typescript-eslint/camelcase': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
    },
  },
]);
