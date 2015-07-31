'use strict';

// Register babel to have ES6 support on the server
require('babel/register');

var gulp = require('gulp');
var header = require('gulp-header');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var importCss = require('gulp-import-css');
var minifyCSS = require('gulp-minify-css');
var prettify = require('gulp-prettify');
var fontgen = require('gulp-fontgen');
var del = require('del');
var base64 = require('gulp-base64');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var karma = require('karma').server;

var pkg = require('./package.json');
var config = require('./config');

var named = require('vinyl-named');
var gulpWebpack = require('gulp-webpack');

gulp.task('css', function() {
  return gulp.src(config.css.files)
    .pipe(plumber())
    .pipe(importCss())
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.css.dest))
    .pipe(connect.reload());
});

gulp.task('sass', function() {
  return gulp.src(config.sass.files)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: config.sass.includePaths || []
    }))
    .pipe(base64({
      extensions: ['svg'],
      debug: true
    }))
    .pipe(csso())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(connect.reload());
});

gulp.task('jade', function() {
  return gulp.src(config.jade.files)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.jade.dest))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  return gulp.src(config.images.files)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.images.dest))
    .pipe(connect.reload());
});

gulp.task('svg', function() {
  return gulp.src(config.svg.files)
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.svg.dest))
    .pipe(connect.reload());
});

gulp.task('fonts', function() {
  return gulp.src(config.fonts.files)
    .pipe(fontgen({
      dest: config.fonts.dest
    }));
});

gulp.task('webpack', function() {
  return gulp.src(config.js.files)
    .pipe(named())
    .pipe(gulpWebpack(config.webpack))
    .pipe(header(config.banner, {pkg: pkg}))
    .pipe(gulp.dest(config.js.dest))
    .pipe(connect.reload());
});

gulp.task('start-server', function() {
  connect.server({
    root: config.server.root,
    host: config.server.host,
    port: config.server.port,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch(config.js.watch, ['webpack']);
  gulp.watch(config.css.watch, ['css']);
  gulp.watch(config.sass.watch, ['sass']);
  gulp.watch(config.jade.watch, ['jade']);
  gulp.watch(config.images.watch, ['images']);
  gulp.watch(config.svg.watch, ['svg']);
  gulp.watch(config.fonts.watch, ['fonts']);
});

gulp.task('watch:test', function() {
  gulp.watch(config.js.watch, ['webpack']);
});

gulp.task('mocha', function() {
  return gulp.src(config.mocha.files)
    .pipe(mochaPhantomJS({
      reporter: 'spec'
    }));
});

gulp.task('karma', function(done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('prettify', ['compile'], function() {
  return gulp.src(config.prettify.files)
    .pipe(prettify({
      indent_size: 2,
      indent_inner_html: true,
      wrap_attributes: true,
      unformatted: []
    }))
    .pipe(gulp.dest(config.prettify.dest));
});

gulp.task('copy', function() {
  return gulp.src(config.copy.files, {
    base: config.copy.base
  }).pipe(gulp.dest(config.copy.dest));
});

gulp.task('clean', function(cb) {
  del.sync([config.clean.files]);
  cb();
});

gulp.task('compile', [
  'copy',
  'svg',
  'webpack',
  'css',
  'sass',
  'jade',
  'fonts',
  'images'
]);

gulp.task('default', ['clean', 'compile', 'start-server', 'watch']);
gulp.task('build', ['clean', 'compile', 'prettify']);
gulp.task('test', ['webpack', 'start-server', 'watch:test']);
gulp.task('test:mocha', ['webpack', 'mocha']);
