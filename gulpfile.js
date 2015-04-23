'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gutil');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var importCss = require('gulp-import-css');
var minifyCSS = require('gulp-minify-css');

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var srcPath = './src';
var isProduction = process.env.NODE_ENV === 'production';
var servePath = isProduction ? './build' : './.httpdocs';

var sassIncludePaths = [];

gulp.task('css:compile', function () {
  gulp.src(srcPath + '/assets/css/vendor.css')
    .pipe(plumber())
    .pipe(importCss())
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(gulp.dest(servePath + '/assets/css'))
    .pipe(connect.reload());
});

gulp.task('sass:compile', function() {
  gulp.src(srcPath + '/assets/css/application.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: sassIncludePaths
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(servePath + '/assets/css'))
    .pipe(connect.reload());
});

gulp.task('jade:compile', function() {
  gulp.src([
      srcPath + '/**/*.jade',
      '!' + srcPath + '/includes/**/*.*',
      '!' + srcPath + '/assets/**/*.*'
    ])
    .pipe(plumber())
    .pipe(jade({
      locals: require(srcPath + '/jade')
    }))
    .pipe(gulp.dest(servePath))
    .pipe(connect.reload());
});

gulp.task('images:compile', function() {
  gulp.src(srcPath + '/assets/img/**/*')
    .pipe(plumber())
    .pipe(changed(servePath + '/assets/img'))
    .pipe(imagemin({
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest(servePath + '/assets/img'))
    .pipe(connect.reload());
});

gulp.task('webpack:compile', function(callback) {
  var config = Object.create(webpackConfig);

  config.output.path = path.resolve(servePath + '/assets/js');

  if (!isProduction) {
    config.devtool = 'source-map';
    config.debug = true;
  } else {
    config.plugins = config.plugins.concat(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true
      })
    );
  }

  webpack(config, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      // output options
    }));

    callback();
  });
});

gulp.task('start-server', function() {
  connect.server({
    root: servePath,
    host: '0.0.0.0',
    port: 8000,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('src/assets/js/**/*.js', ['webpack:compile']);
  gulp.watch('src/assets/css/vendor.css', ['css:compile']);
  gulp.watch('src/assets/css/**/*.scss', ['sass:compile']);
  gulp.watch('src/**/*.jade', ['jade:compile']);
  gulp.watch('src/assets/img/**/*', ['images:compile']);
});

gulp.task('compile', [
  'webpack:compile',
  'css:compile',
  'sass:compile',
  'jade:compile',
  'images:compile'
]);

gulp.task('default', ['compile', 'start-server', 'watch']);
