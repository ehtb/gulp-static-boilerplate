var gulp = require('gulp');

gulp.task('compile', [
  'copy',
  'webpack',
  'css',
  'sass',
  'jade',
  'images'
]);