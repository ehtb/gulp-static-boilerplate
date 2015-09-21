var webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [],
    application: './src/assets/js/application.js'
  },

  output: {
    publicPath: '/assets/js/',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },

  resolve: {
    modulesDirectories: ['./node_modules', './bower_components', './src/js/vendor'],
    extensions: ['', '.js', '.coffee'],
    alias: {
      'waypoint': 'waypoints/lib/jquery.waypoints.js',
      'sticky' : 'waypoints/lib/shortcuts/sticky.js',
      'dat.gui' : 'dat.gui.js'
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|vendor/,
        loader: 'babel-loader?optional=runtime'
      },
      {
        test: /dat/,
        loader: 'exports?dat.GUI'
      }
    ]
  },

  externals: {
    jquery: 'jQuery'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
  ]
};