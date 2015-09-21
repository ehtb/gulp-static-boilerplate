require('babel/register');

var gulp = require('gulp'),
  config = require('./../../config');

gulp.task('copy', function() {
  return gulp.src(config.copy.files, {
    base: config.copy.base
  }).pipe(gulp.dest(config.copy.dest));
});