var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var assetsPath = path.resolve(__dirname, 'build');
var appPath = path.resolve(__dirname, 'app');
var modulePath = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: '#cheap-module-source-map',

  entry: {
    '~hot-webpack-dev-server': ['webpack-dev-server/client'] // ?http://localhost:8080
  },
  output: {
    path: assetsPath,
    publicPath: "/",
    filename: '[name].js',
    chunkname: '[chunkName].js'
  },
  resolve: {
    extensions: ['', '.js', '.json'],
    alias: {
      lib: path.resolve(appPath, 'lib')
    }
  },

  externals: {
    jQuery: true,
    $: true
  },

  module: {
    loaders: [{
      test: /\.(css|less)$/i,
      loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
          // 'style!css?sourceMap!less?sourceMap'
          // ExtractTextPlugin.extract('style', 'css!less')
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      loaders: ['url?limit=2048' /* , 'image-webpack' */]
    }, {
      test: /\.js$/i,
      exclude: /node_modules/,
      // loaders: ["es3ify", "babel"]
      loaders: ["babel"]
    }, {
      test: /\.json$/i,
      loader: "json"
    }, {
      test: /\.tmpl$/i,
      loader: "raw"
    }]
  },
  plugins: [
    new CleanPlugin([assetsPath]),

    new webpack.optimize.CommonsChunkPlugin('~webpack.js'),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  ],

  // --------------------
  imageWebpackLoader: {
    pngquant: {
      quality: "40-90",
      speed: 4
    }
  }

};