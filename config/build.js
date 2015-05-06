export default {
  css: {
    files: [
      './src/assets/css/vendor.css'
    ],
    dest: './build/assets/css'
  },
  sass: {
    files: [
      './src/assets/css/application.scss'
    ],
    dest: './build/assets/css',
    includePaths: []
  },
  jade: {
    files: [
      './src/**/*.jade',
      '!./src/includes/**/*.*',
      '!./src/assets/**/*.*'
    ],
    locals: './src/jade.js',
    dest: './build'
  },
  images: {
    files: [
      './src/assets/img/**/*'
    ],
    dest: './build/assets/img'
  },
  js: {
    files: {
      vendor: './src/assets/js/vendor.js',
      application: './src/assets/js/application.js'
    },
    dest: './build/assets/js/'
  },
  copy: {
    files: [
      './src/sitemap.xml',
      './src/robots.txt'
    ],
    base: './src',
    dest: './.httpdocs'
  }
};
