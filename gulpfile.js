'use strict';

require('babel/register');

var gulp = require('gulp'),
  requireDir  = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });

gulp.task('compile', [
  'copy',
  'webpack',
  'css',
  'sass',
  'jade',
  'images'
]);

gulp.task('default', ['compile', 'start-server', 'watch']);
gulp.task('build', ['compile', 'prettify']);

///watch with color login
///https://github.com/alexweber/es6-jspm-gulp-boilerplate/blob/master/gulp/watch.js