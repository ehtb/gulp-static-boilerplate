var webpack = require('webpack');

module.exports = {
  entry: {
    vendor: './src/assets/js/vendor.js',
    application: './src/assets/js/application.js'
  },

  output: {
    publicPath: '/assets/js/',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },

  resolve: {
    modulesDirectories: ['./node_modules', './bower_components'],
    extensions: ['', '.js', '.coffee']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },

  externals: {

  },

  plugins: [
    new webpack.ProvidePlugin({

    })
  ]
};
