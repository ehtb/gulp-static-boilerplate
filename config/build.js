import _ from 'lodash';

let webpack = require('webpack');

let src = './src';
let dest = './build';

let base = require('./base');

export default _.merge(base, {
  clean: {
    files: `${dest}/**/*`
  },
  banner: [
    '/**',
    ' ** <%= pkg.name %> - <%= pkg.description %>',
    ' ** @author <%= pkg.author %>',
    ' ** @version v<%= pkg.version %>',
    ' **/'
  ].join('\n'),
  css: {
    files: [
      `${src}/assets/css/vendor.css`
    ],
    dest: `${dest}/assets/css`
  },
  sass: {
    files: [
      `${src}/assets/css/application.scss`
    ],
    dest: `${dest}/assets/css`,
    includePaths: []
  },
  jade: {
    files: [
      `${src}/**/*.jade`,
      `!${src}/includes/**/*.*`,
      `!${src}/assets/**/*.*`
    ],
    dest: `${dest}`
  },
  images: {
    files: [
      `${src}/assets/img/**/*.{png,jpg}`
    ],
    dest: `${dest}/assets/img`
  },
  svg: {
    files: [
      `${src}/assets/css/svg/src/**/*.svg`
    ],
    dest: `${src}/assets/css/svg/minified`
  },
  js: {
    files: [
      `${src}/assets/js/vendor.js`,
      `${src}/assets/js/application.js`
    ],
    dest: `${dest}/assets/js/`
  },
  fonts: {
    files: [
      `${src}/assets/fonts/**/*.{otf,ttf}`
    ],
    dest: `${dest}/assets/fonts`
  },
  prettify: {
    files: `${src}/**/*.html`,
    dest: dest
  },
  webpack: {
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(false),
        __TEST__: JSON.stringify(false),
        __RELEASE__: JSON.stringify(true)
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
  },
  copy: {
    files: [
      `${src}/sitemap.xml`,
      `${src}/robots.txt`,
      `${src}/assets/fonts/*`,
      `${src}/assets/swf/*`
    ],
    base: `${src}`,
    dest: `${dest}`
  }
});
