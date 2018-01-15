const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  target: 'web',
  entry: path.resolve(__dirname, './src/PullRefresh.js'),
  output: {
    filename: 'ptr.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    library: 'PTR',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /.\css$/,
        use: ['style-loader', 'css-loader?sourceMap']
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?sourceMap', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: false,
      dry: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin('ptr.css', {
      allChunk: true
    }),
  ],

  devServer: {
    compress: true,
    contentBase: "./",
    port: 1333,
    disableHostCheck: true
  }
}

if (isProd) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourcemap: true,
      compress: {
        warnings: false
      }
    })
  )
}