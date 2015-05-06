export default {
  css: {
    files: [
      './src/assets/css/vendor.css'
    ],
    dest: './.httpdocs/assets/css',
    watch: './src/assets/css/**/*.css'
  },
  sass: {
    files: [
      './src/assets/css/application.scss'
    ],
    dest: './.httpdocs/assets/css',
    watch: './src/assets/css/**/*.scss',
    includePaths: []
  },
  jade: {
    files: [
      './src/**/*.jade',
      '!./src/includes/**/*.*',
      '!./src/assets/**/*.*'
    ],
    locals: './src/jade.js',
    dest: './.httpdocs',
    watch: './src/**/*.jade'
  },
  images: {
    files: [
      './src/assets/img/**/*'
    ],
    dest: './.httpdocs/assets/img',
    watch: './src/assets/img/**/*'
  },
  js: {
    files: {
      vendor: './src/assets/js/vendor.js',
      application: './src/assets/js/application.js'
    },
    dest: './.httpdocs/assets/js/',
    watch: './src/assets/js/**/*.js'
  },
  copy: {
    files: [
      './src/sitemap.xml',
      './src/robots.txt'
    ],
    base: './src',
    dest: './.httpdocs'
  },
  server: {
    root: './.httpdocs',
    host: '0.0.0.0',
    port: 8000
  }
};
