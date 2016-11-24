var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var configBase = require('./webpack.config.base');
var assetsPath = path.resolve(__dirname, 'build');

configBase.entry.search = ['./app/search.js']

if (process.argv.indexOf('--buildProject') > 0) {
  delete configBase.devtool;
  delete configBase.entry['~hot-webpack-dev-server'];
  configBase.plugins.shift();
  Array.prototype.unshift.apply(configBase.plugins, [
    new CleanPlugin([assetsPath]),
  ]);
  Array.prototype.push.apply(configBase.plugins, [
    new webpack.optimize.UglifyJsPlugin(),
  ]);
  configBase.output.path = assetsPath;
  //configBase.output.publicPath = "/ve/suiyi/build/";
}

Array.prototype.push.apply(configBase.plugins, [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './entry/index.html',
    hash: true
  }),
  new HtmlWebpackPlugin({
    filename: 'job_list.html',
    template: './entry/job_list.html',
    hash: true
  }),
  new HtmlWebpackPlugin({
    filename: 'detail.html',
    template: './entry/detail.html',
    hash: true
  })
]);

module.exports = configBase;