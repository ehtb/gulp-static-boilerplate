var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  jade = require('gulp-jade'),
  config = require('./../../config'),
  connect = require('gulp-connect');

gulp.task('jade', function() {
  return gulp.src(config.jade.files)
    .pipe(plumber())
    .pipe(jade({
      locals: config.jade.locals
    }))
    .pipe(gulp.dest(config.jade.dest))
    .pipe(connect.reload());
});