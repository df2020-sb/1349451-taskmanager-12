const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
  },

  devtool: 'source-map',
  devServer: {
    port: 5050,
    contentBase: path.join(__dirname, 'public'),
    hot: true,
  },
};
