export default {
  banner: '',
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
    includePaths: [].concat(
      './node_modules/breakpoint-sass/stylesheets',
      './node_modules/susy/sass'
    )
  },
  jade: {
    files: [
      './src/**/*.jade',
      '!./src/includes/**/*.*',
      '!./src/assets/**/*.*'
    ],
    locals: {
      pretty: true
    },
    dest: './.httpdocs',
    watch: './src/**/*.jade'
  },
  images: {
    files: [
      './src/assets/images/**/*'
    ],
    dest: './.httpdocs/assets/images',
    watch: './src/assets/images/**/*'
  },
  json: {
    watch: './src/assets/**/*.json'
  },
  js: {
    files: [
      './src/assets/js/vendor.js',
      './src/assets/js/application.js'
    ],
    dest: './.httpdocs/assets/js/',
    watch: './src/js/**/*.js'
  },
  copy: {
    files: [
    
      './src/assets/audio/**/*',
      './src/sitemap.xml',
      './src/robots.txt',
      './src/assets/**/*.json'
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
