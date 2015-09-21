var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  changed = require('gulp-changed'),
  config = require('./../../config'),
  imagemin = require('gulp-imagemin'),
  connect = require('gulp-connect');

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
