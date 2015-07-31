export default {
  webpack: {
    resolve: {
      modulesDirectories: ['./node_modules', './bower_components'],
      extensions: ['', '.js', '.coffee'],
      alias: {
        'eventEmitter/EventEmitter': 'wolfy87-eventemitter'
      }
    },

    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?optional=runtime'
      }]
    },

    externals: {
      jquery: 'jQuery'
    }
  }
};
