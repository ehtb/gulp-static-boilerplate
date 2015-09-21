var gulp = require('gulp'),
  header = require('gulp-header'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  pkg = require('./../../package.json'),
  config = require('./../../config'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  base64 = require('gulp-base64'),
  connect = require('gulp-connect');

gulp.task('sass', function() {
  return gulp.src(config.sass.files)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: config.sass.includePaths || []
    }))

    .pipe(base64({
      extensions: ['svg'],
      debug: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(connect.reload());
});