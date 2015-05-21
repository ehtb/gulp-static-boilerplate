'use strict';

// Register babel to have ES6 support on the server
require('babel/register');

let gulp = require('gulp');
let header = require('gulp-header');
let plumber = require('gulp-plumber');
let changed = require('gulp-changed');
let sass = require('gulp-sass');
let csso = require('gulp-csso');
let imagemin = require('gulp-imagemin');
let jade = require('gulp-jade');
let connect = require('gulp-connect');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let importCss = require('gulp-import-css');
let minifyCSS = require('gulp-minify-css');
let pkg = require('./package.json');

let config = require('./config');

let webpack = require('webpack');
let named = require('vinyl-named');
let gulpWebpack = require('gulp-webpack');
let webpackConfig = require('./webpack.config.js');

gulp.task('css', function () {
  gulp.src(config.css.files)
    .pipe(plumber())
    .pipe(importCss())
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.css.dest))
    .pipe(connect.reload());
});

gulp.task('sass', function() {
  gulp.src(config.sass.files)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: config.sass.includePaths || []
    }))
    .pipe(csso())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(connect.reload());
});

gulp.task('jade', function() {
  gulp.src(config.jade.files)
    .pipe(plumber())
    .pipe(jade({
      locals: require(config.jade.locals)
    }))
    .pipe(gulp.dest(config.jade.dest))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  gulp.src(config.images.files)
    .pipe(plumber())
    .pipe(changed(config.images.dest))
    .pipe(imagemin({
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest(config.images.dest))
    .pipe(connect.reload());
});

gulp.task('webpack', function(callback) {
  var wpConfig = Object.create(webpackConfig);

  if (process.env.NODE_ENV === 'production') {
    wpConfig.plugins = wpConfig.plugins.concat(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true
      })
    );
  } else {
    wpConfig.devtool = 'source-map';
    wpConfig.debug = false;
  }

  gulp.src(config.js.files)
    .pipe(named())
    .pipe(gulpWebpack(wpConfig))
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.js.dest))
    .pipe(connect.reload());
});

gulp.task('start-server', function() {
  connect.server({
    root: config.server.root,
    host: config.server.host,
    port: config.server.port,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch(config.js.watch, ['webpack']);
  gulp.watch(config.css.watch, ['css']);
  gulp.watch(config.sass.watch, ['sass']);
  gulp.watch(config.jade.watch, ['jade']);
  gulp.watch(config.images.watch, ['images']);
});

gulp.task('copy', function() {
  gulp.src(config.copy.files, {
    base: config.copy.base
  }).pipe(gulp.dest(config.copy.dest));
});

gulp.task('compile', [
  'copy',
  'webpack',
  'css',
  'sass',
  'jade',
  'images'
]);

gulp.task('default', ['copy', 'compile', 'start-server', 'watch']);
gulp.task('build', ['copy', 'compile']);
