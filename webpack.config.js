module.exports = {
  output: {
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

  plugins: []
};
