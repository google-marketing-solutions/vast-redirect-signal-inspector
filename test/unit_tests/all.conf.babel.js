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
 * @fileoverview Karma configuration for all unit tests.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import webpackConfig from '../../build/webpack.config.test.babel.js';

// Karma Test Config
export default (config) => {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],
    files: [
      {
        pattern: 'src/**/*_test.js',
        watched: false,
      },
      {
        pattern: 'src/**/*.json',
        served: true,
        included: false,
      },
    ],
    preprocessors: {
      'src/**/*_test.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha', 'coverage-istanbul'],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
    coverageIstanbulReporter: {
      combineBrowserReports: true,
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        html: {
          subdir: 'html',
        },
      },
      reports: ['html', 'lcovonly', 'text'],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    browsers: ['ChromeHeadless'],
  });
};
