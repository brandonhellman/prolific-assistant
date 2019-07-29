const entry = require('./webpack.entry');
const assets = require('./webpack.plugin.assets');
const html = require('./webpack.plugin.html');
const manifest = require('./webpack.plugin.manifest');

module.exports = {
  entry,

  output: {
    path: __dirname + '/build',
  },

  mode: 'production',

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [...html, assets, manifest],
};
