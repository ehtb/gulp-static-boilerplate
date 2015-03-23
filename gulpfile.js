'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var importCss = require('gulp-import-css');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackConfig = require('./webpack.config.js');

var compress = require('compression');

var neat = require('node-neat');
var bourbon = require('node-bourbon');

var sourcePath = './src';
var serverPath = './httpdocs';
var buildPath = './build';

var sassIncludePaths = [].concat(
                        neat.includePaths,
                        bourbon.includePaths
                      );

gulp.task('css:compile', function () {
  gulp.src(sourcePath + '/assets/css/vendor.css')
    .pipe(plumber())
    .pipe(importCss())
    .pipe(gulp.dest(serverPath + '/assets/css'));
});

gulp.task('css:build', function () {
  gulp.src(sourcePath + '/assets/css/vendor.css')
    .pipe(plumber())
    .pipe(importCss())
    .pipe(gulp.dest(buildPath + '/assets/css'));
});

gulp.task('sass:compile', function() {
  gulp.src(sourcePath + '/assets/css/application.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: sassIncludePaths
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(serverPath + '/assets/css'))
    .pipe(connect.reload());
});

gulp.task('sass:build', function() {
  gulp.src(sourcePath + '/assets/css/application.scss')
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: sassIncludePaths
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(buildPath + '/assets/css'));
});

gulp.task('jade:compile', function() {
  gulp.src([
      sourcePath + '/**/*.jade',
      '!' + sourcePath + '/includes/**/*.*',
      '!' + sourcePath + '/assets/**/*.*'
    ])
    .pipe(plumber())
    .pipe(jade({
      locals: require(sourcePath + '/jade')
    }))
    .pipe(gulp.dest(serverPath))
    .pipe(connect.reload());
});

gulp.task('jade:build', function() {
  gulp.src([
      sourcePath + '/**/*.jade',
      '!' + sourcePath + '/includes/**/*.*',
      '!' + sourcePath + '/assets/**/*.*'
    ])
    .pipe(plumber())
    .pipe(jade({
      locals: require(sourcePath + '/jade')
    }))
    .pipe(gulp.dest(buildPath));
});

gulp.task('images:compile', function() {
  gulp.src(sourcePath + '/assets/img/**/*')
    .pipe(plumber())
    .pipe(changed(serverPath + '/assets/img'))
    .pipe(imagemin({
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest(serverPath + '/assets/img'))
    .pipe(connect.reload());
});

gulp.task('images:build', function() {
  gulp.src(sourcePath + '/assets/img/**/*')
    .pipe(plumber())
    .pipe(changed(buildPath + '/assets/img'))
    .pipe(imagemin({
      svgoPlugins: [{
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest(buildPath + '/assets/img'));
});

gulp.task('webpack:build', function(callback) {
  var config = Object.create(webpackConfig);
  config.output.path = path.resolve(buildPath + '/assets/js');

  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    })
  );

  webpack(config, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }

    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));

    callback();
  });
});

gulp.task('server', function() {
  var config = Object.create(webpackConfig);
  config.devtool = 'source-map';
  config.cache = true;
  config.debug = true;
  config.output.path = path.resolve(serverPath + '/assets/js');

  connect.server({
    root: serverPath,
    host: '0.0.0.0',
    port: 8000,
    livereload: true,
    middleware: function() {
      return [
        compress({
          level: 9
        }),
        webpackMiddleware(webpack(config), {
          publicPath: config.output.publicPath,
          stats: {
            colors: true
          }
        })
      ];
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('src/assets/css/vendor.js', ['css:compile']);
  gulp.watch('src/assets/css/**/*', ['sass:compile']);
  gulp.watch('src/**/*.jade', ['jade:compile']);
  gulp.watch('src/assets/img/**/*', ['images:compile']);
});

gulp.task('compile', [
  'css:compile',
  'sass:compile',
  'jade:compile',
  'images:compile'
]);

gulp.task('default', ['compile', 'server', 'watch']);

gulp.task('build', [
  'css:build',
  'sass:build',
  'jade:build',
  'images:build',
  'webpack:build'
]);
