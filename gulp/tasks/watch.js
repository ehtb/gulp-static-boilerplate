var gulp = require('gulp'),
  config = require('./../../config');

gulp.task('watch', function() {
  gulp.watch(config.json.watch, ['copy']);
  gulp.watch(config.js.watch, ['webpack']);
  gulp.watch(config.css.watch, ['css']);
  gulp.watch(config.sass.watch, ['sass']);
  gulp.watch(config.jade.watch, ['jade']);
  gulp.watch(config.images.watch, ['images']);
});