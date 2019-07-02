const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

require('dotenv').config()

const dev = process.env.NODE_ENV === 'develop'
const port = process.env.WEBPACK_PORT || 8080

// Plugins
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

module.exports = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'inline-source-map' : '',
  entry: {
    main: __dirname + '/src'
  },
  output: {
    path: __dirname + '/app/',
    filename: 'bundle.js'
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.(txt|frag|vert|obj)$/,
        use: 'raw-loader'
      },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader',
          'svgo-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new SpriteLoaderPlugin()
  ],
  devServer: {
    port: port,
    contentBase: 'app/'
  },
  target: 'electron-renderer'
}
