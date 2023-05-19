// Copyright (C) Microsoft Corp. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const path = require('path');

const umdConfiguration = {
  entry: './src/index.ts',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.ts'],
  },
  devtool: 'hidden-source-map',
  optimization: {
    providedExports: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.cjs',
    library: {
      name: 'edge-devtools-crash-analyzer-support',
      type: 'umd',
    },
  },
  // experiments: {
  //   outputModule: true,
  // },
};

const esmConfiguration = {
  entry: './src/index.ts',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: [
        /node_modules/,
        /demo/,
      ],
    }],
  },
  resolve: {
    extensions: ['.ts'],
  },
  devtool: 'hidden-source-map',
  optimization: {
    providedExports: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.mjs',
    library: { type: 'module' },
  },
  experiments: {
    outputModule: true,
  },
};

module.exports = [umdConfiguration, esmConfiguration];
