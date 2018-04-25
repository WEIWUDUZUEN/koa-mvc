// hot.js
'use strict';

const webpack = require('webpack');
const wdm = require('webpack-dev-middleware');
const whm = require('webpack-hot-middleware');

const config = require('config');
const compiler = webpack(config);

function initHot(app) {
  app.use(wdm(compiler, {
    publicPath: config.get('fe.publicPath'),
    stats: {
      colors: true,
    },
  }));

  app.use(whm(compiler));
}

module.exports = initHot;