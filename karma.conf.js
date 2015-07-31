'use strict';

import _ from 'lodash';

let config = require('./config');

module.exports = function(karma) {
  karma.set({
    basePath: '.',
    frameworks: ['mocha'],
    files: [
      'src/assets/js/vendor.js',
      'test/**/*-test.js'
    ],
    preprocessors: {
      'src/assets/js/vendor.js': ['webpack', 'sourcemap'],
      'test/**/*-test.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    port: 9877,
    colors: true,
    autoWatch: true,
    browsers: [/*'Chrome', 'Firefox', */'PhantomJS'],
    webpack: _.merge(config.webpack, {
      devtool: 'inline-source-map'
    }),
    webpackMiddleware: {
      noInfo: true
    },
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader'
    ],
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    client: {
      mocha: {
        reporter: 'html',
        ui: 'tdd'
      }
    }
  });
};
