import _ from 'lodash';

let webpack = require('webpack');

let src = './src';
let test = './test';

let base = require('./base');

export default _.merge(base, {
  banner: '',
  js: {
    files: [
      `${test}/entry/test.js`
    ],
    dest: `${test}/fixtures/js`,
    watch: [
      `${src}/assets/js/**/*.js`,
      `${test}/entry/test.js`,
      `${test}/tests/**/*.js`
    ]
  },
  mocha: {
    files: `${test}/fixtures/index.html`
  },
  webpack: {
    devtool: 'source-map',
    debug: true,
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
        __TEST__: JSON.stringify(true),
        __RELEASE__: JSON.stringify(false)
      })
    ]
  },
  server: {
    root: `${test}/fixtures`,
    host: '0.0.0.0',
    port: 8000
  }
});
