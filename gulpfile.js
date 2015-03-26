'use strict';

var path = require('path');
var gulp = require('gulp');
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
var gulpWebpack = require('gulp-webpack');

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var neat = require('node-neat');
var bourbon = require('node-bourbon');

var srcPath = './src';
var nodeEnv = process.env.NODE_ENV;
var isProduction = nodeEnv === 'production';
var servePath = isProduction ? './httpdocs' : 'build';

var sassIncludePaths = [].concat(
                        neat.includePaths,
                        bourbon.includePaths
                      );

gulp.task('css', function () {
  gulp.src(srcPath + '/assets/css/vendor.css')
    .pipe(plumber())
    .pipe(importCss())
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(gulp.dest(servePath + '/assets/css'))
    .pipe(connect.reload());
});

gulp.task('sass', function() {
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

gulp.task('jade', function() {
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

gulp.task('images', function() {
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

gulp.task('webpack', function(callback) {
  var config = Object.create(webpackConfig);

  if (!isProduction) {
    config.devtool = 'source-map';
    config.cache = true;
    config.debug = true;
  } else {
    config.plugins = config.plugins.concat(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true
      })
    );
  }

  gulp.src(srcPath + '/assets/js/**/*')
    .pipe(plumber())
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest(path.resolve(servePath + '/assets/js')))
    .pipe(connect.reload());
});

gulp.task('server', function() {
  connect.server({
    root: servePath,
    host: '0.0.0.0',
    port: 8000,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('src/assets/css/vendor.js', ['css']);
  gulp.watch('src/assets/css/**/*', ['sass']);
  gulp.watch('src/**/*.jade', ['jade']);
  gulp.watch('src/assets/img/**/*', ['images']);
  gulp.watch('src/assets/js/**/*.js', ['webpack']);
});

gulp.task('compile', [
  'css',
  'sass',
  'jade',
  'images',
  'webpack'
]);

gulp.task('default', ['compile', 'server', 'watch']);
