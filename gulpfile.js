'use strict';

// Register babel to have ES6 support on the server
require('babel/register');

var gulp = require('gulp');
var header = require('gulp-header');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var importCss = require('gulp-import-css');
var minifyCSS = require('gulp-minify-css');
var pkg = require('./package.json');

var config = require('./config');

var webpack = require('webpack');
var named = require('vinyl-named');
var gulpWebpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task('css', function () {
  return gulp.src(config.css.files)
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
  return gulp.src(config.sass.files)
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
  return gulp.src(config.jade.files)
    .pipe(plumber())
    .pipe(jade({
      locals: config.jade.locals
    }))
    .pipe(gulp.dest(config.jade.dest))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  return gulp.src(config.images.files)
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

  return gulp.src(config.js.files)
    .pipe(named())
    .pipe(gulpWebpack(wpConfig))
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.js.dest))
    .pipe(connect.reload());
});

gulp.task('start-server', function() {
  return connect.server({
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
  return gulp.src(config.copy.files, {
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
