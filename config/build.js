export default {
  banner: [
    '/**',
    ' ** <%= pkg.name %> - <%= pkg.description %>',
    ' ** @author <%= pkg.author %>',
    ' ** @version v<%= pkg.version %>',
    ' **/'
  ].join('\n'),
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
    includePaths: [].concat(
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
    dest: './build'
  },
  images: {
    files: [
      './src/assets/img/**/*'
    ],
    dest: './build/assets/img'
  },
  js: {
    files: [
      './src/assets/js/vendor.js',
      './src/assets/js/application.js'
    ],
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
