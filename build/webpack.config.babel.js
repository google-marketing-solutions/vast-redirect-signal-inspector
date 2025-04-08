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
 * @fileoverview Webpack core config for development, production and deploy.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import { version } from '../package.json';

module.exports = (mode = 'development') => ({
  mode: mode == 'deploy' ? 'production' : mode,
  target: 'web',
  performance: {
    hints: mode == 'deploy' || mode == 'production' ? false : 'warning',
    maxAssetSize: mode == 'development' ? 4096000 : 250000,
    maxEntrypointSize: mode == 'development' ? 1000000 : 250000,
  },
  devServer: {
    compress: true,
    headers: {
      'Cache-Control': 'max-age=0',
      'X-Mode': mode,
    },
    liveReload: mode == 'development',
    open: mode == 'development',
    static: path.join(__dirname, '..', 'static'),
    client: {
      overlay: {
        errors: mode != 'production',
        warnings: false,
      },
    },
  },
  entry: {
    app: ['./src/components/App/index.js', './assets/css/app.css'],
  },
  output: {
    publicPath: mode == 'deploy' ? '/vast-redirect-signal-inspector/' : '/',
    path: path.join(__dirname, '..', 'dist'),
    filename: (pathData) => {
      return mode == 'development'
        ? 'js/[name].js'
        : 'js/[name].[contenthash].js';
    },
  },
  devtool: mode == 'development' ? 'inline-source-map' : false,
  resolve: {
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '..', 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.[jt]sx?$/,
        use: ['babel-loader', '@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(json|xml)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.json$/,
        type: 'json',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      exclude: /.map$/,
      deleteOriginalAssets: 'keep-source-map',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './assets/favicon',
          to: './favicon',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/logo',
          to: './assets/logo',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/png',
          to: './assets/png',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        /*
        {
          from: './assets/favicon/browserconfig.xml',
          to: './browserconfig.xml',
        },
        {
          from: './assets/icons',
          to: './assets/icons',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './locales',
          to: './locales',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },*/
        {
          from: './src/manifest.json',
          to: './manifest.json',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'VAST Redirect Signal Inspector',
      template: './src/index.html',
      favicon: 'assets/favicon/favicon.ico',
      inject: false,
      enforce: 'post',
    }),
    new DefinePlugin({
      VERSION: JSON.stringify(version),
    }),
  ],
  optimization: {
    emitOnErrors: true,
    runtimeChunk: {
      name: (entrypoint) => {
        if (entrypoint.name == 'app') {
          return `runtime-${entrypoint.name}`;
        }
        return null;
      },
    },
    splitChunks: {
      chunks(chunk) {
        return chunk?.name == 'app';
      },
    },
    minimize: mode != 'development',
    minimizer: [
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
      new JsonMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
});
