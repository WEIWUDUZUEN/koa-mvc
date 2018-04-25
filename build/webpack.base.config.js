'use strict'

const fs = require('fs')
const path = require('path')
const config = require('config')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const vueConfig = require('./vue-loader.config')

const isProd = process.env.NODE_ENV === 'production'
const resolve = dir => path.resolve(__dirname, dir)

config.fe.host = config.host
config.fe.port = config.port
fs.writeFileSync(resolve('../views/config.json'), JSON.stringify(config.fe))

module.exports = {
//   devtool: isProd ? false : '#cheap-module-source-map',
  devtool: isProd ? false : '#source-map',
  output: {
    path: resolve('../dist'),
    publicPath: config.get('fe.publicPath'),
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.md'],
    alias: {
      '~~': resolve('../'),
      '~': resolve('../views'),
      'pages': resolve('../views/pages'),
      'components': resolve('../views/components'),
      'config': resolve('../views/config.json')
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.(vue|js)$/,
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      { // .map 映射文件
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        use: isProd ?
          ExtractTextPlugin.extract({
            use: 'css-loader?minimize&importLoaders=1!postcss-loader',
            fallback: 'vue-style-loader'
          }) :
          [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
      },
      {
        test: /\.snippets/,
        loader: 'raw-loader'
      },
      // {
      //   test: /\.md/,
      //   loader: 'vue-markdown-loader',
      //   options: {
      //     breaks: false,
      //     use: [
      //       require('markdown-it-attrs'),
      //       [require('markdown-it-anchor'), {
      //         permalinkClass: 'anchor',
      //         slugify: require('transliteration').slugify,
      //         permalinkSymbol: '<i class="ivu-icon ivu-icon-link octicon-link"></i>',
      //         permalink: true,
      //         permalinkBefore: true
      //       }]
      //     ]
      //   }
      // }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    //hints: isProd ? 'warning' : false     // 资源文件大小检测警告
  },
  plugins: isProd ?
    [
    //   new webpack.optimize.UglifyJsPlugin({  // 代码压缩
    //     compress: {
    //       warnings: false
    //     }
    //   }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      })
    ] :
    [
      new FriendlyErrorsPlugin()
    ]
}