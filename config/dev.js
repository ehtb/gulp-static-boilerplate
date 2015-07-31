import _ from 'lodash';

let webpack = require('webpack');

let src = './src';
let dest = './.httpdocs';

let base = require('./base');

export default _.merge(base, {
  clean: {
    files: `${dest}/**/*`
  },
  banner: '',
  css: {
    files: [
      `${src}/assets/css/vendor.css`
    ],
    dest: `${dest}/assets/css`,
    watch: `${src}/assets/css/**/*.css`
  },
  sass: {
    files: [
      `${src}/assets/css/application.scss`
    ],
    dest: `${dest}/assets/css`,
    watch: `${src}/assets/css/**/*.scss`,
    includePaths: []
  },
  jade: {
    files: [
      `${src}/**/*.jade`,
      `!${src}/includes/**/*.*`,
      `!${src}/assets/**/*.*`
    ],
    dest: `${dest}`,
    watch: `${src}/**/*.jade`
  },
  images: {
    files: [
      `${src}/assets/img/**/*.{png,jpg}`
    ],
    dest: `${dest}/assets/img`,
    watch: [
      `${src}/assets/img/**/*.{png,jpg}`
    ]
  },
  fonts: {
    files: [
      `${src}/assets/fonts/*.{otf,ttf}`
    ],
    dest: `${dest}/assets/fonts`,
    watch: [
      `${src}/assets/fonts/*.{otf,ttf}`
    ]
  },
  svg: {
    files: [
      `${src}/assets/css/svg/src/**/*.svg`
    ],
    dest: `${src}/assets/css/svg/minified`,
    watch: [
      `${src}/assets/css/svg/src/*.svg`,
      `${src}/assets/css/svg/src/**/*.svg`
    ]
  },
  js: {
    files: [
      `${src}/assets/js/vendor.js`,
      `${src}/assets/js/application.js`
    ],
    dest: `${dest}/assets/js/`,
    watch: `${src}/assets/js/**/*.js`
  },
  webpack: {
    devtool: 'source-map-inline',
    debug: true,
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
        __TEST__: JSON.stringify(false),
        __RELEASE__: JSON.stringify(false)
      })
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
  },
  server: {
    root: `${dest}`,
    host: '0.0.0.0',
    port: 8000
  }
});
