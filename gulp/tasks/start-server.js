var gulp = require('gulp'),
  connect = require('gulp-connect'),
  config = require('./../../config');
  
gulp.task('start-server', function() {
  connect.server({
    root: config.server.root,
    host: config.server.host,
    port: config.server.port,
    livereload: true
  });
});