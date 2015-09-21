var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  header = require('gulp-header'),
  pkg = require('./../../package.json'),
  config = require('./../../config'),
  importCss = require('gulp-import-css'),
  connect = require('gulp-connect');

gulp.task('css', function () {
  return gulp.src(config.css.files)
    .pipe(plumber())
    .pipe(importCss())
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.css.dest))
    .pipe(connect.reload());
});
