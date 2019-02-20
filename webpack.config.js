const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './test.js',
  mode: 'development',

  devServer: {
    https: false,
    port: 8445,
    contentBase: './dist',
    hot: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
