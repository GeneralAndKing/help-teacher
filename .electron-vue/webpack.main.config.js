'use strict'

process.env.BABEL_ENV = 'main'
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BabiliWebpackPlugin = require('babili-webpack-plugin')

// 模块配置
let mainConfig = {
  entry: {
    // 入口文件地址，不需要写完，会自动查找
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  // 加载器
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.styl(us)$/,
        use: ['vue-style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  // 输出
  output: {
    filename: '[name].js',
    // [name]这里是webpack提供的根据路口文件自动生成的名字
    libraryTarget: 'commonjs2',
    // 文件地址，使用绝对路径形式
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}
// 模块导入
module.exports = mainConfig
