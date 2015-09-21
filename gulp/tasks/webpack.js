var gulp = require('gulp'),
  config = require('./../../config'),
  header = require('gulp-header'),
  pkg = require('./../../package.json'),
  connect = require('gulp-connect'),
  webpackConfig = require('./../../webpack.config.js'),
  gulpWebpack = require('gulp-webpack');

gulp.task('webpack', function(callback) {
  var wpConfig = Object.create(webpackConfig);

  wpConfig.devtool = 'source-map';
  wpConfig.debug = false;

  return gulp.src(config.js.files)
    .pipe(gulpWebpack(wpConfig))
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.js.dest))
    .pipe(connect.reload());
});