'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var koaJwt = require('koa-jwt');
var cors = require('@koa/cors');
var koaBody = require('koa-body');
var onerror = require('koa-onerror');
var favicon = require('koa-favicon');
var validate = require('koa-validate');
var pathToRegexp = require('path-to-regexp');
var staticCache = require('koa-static-cache');

var util = require('./util');
var logger = require('./util/logger');
var middleware = require('./middlewares');
var routerConfig = require('./router-config');

var app = module.exports = new _koa2.default();
var uploadConf = _config2.default.get('upload');
var jwtSecret = _config2.default.get('jwt.secret');

util.init();
onerror(app);
validate(app);

app.use(middleware.ipFilter).use(favicon(_path2.default.join(__dirname, '/public/images/icon.png'))).use(serve('/dist', './dist')).use(serve('/public', './public')).use(serve('/upload', _path2.default.resolve(__dirname, 'config', uploadConf.dir)))
// .use(logger)
.use(middleware.util).use(cors({
    credentials: true,
    maxAge: 2592000
})).use(koaJwt({
    secret: jwtSecret
}).unless(function (ctx) {
    // 不需要 jwt 验证的接口
    if (/^\/api/.test(ctx.path)) {
        return pathToRegexp(['/api/login', '/api/register']).test(ctx.path);
    }
    return true;
})).use(koaBody({
    multipart: true
})).use(routerConfig.api.routes()).use(routerConfig.api.allowedMethods()).use(routerConfig.hxl.routes()).use(routerConfig.hxl.allowedMethods());

app.proxy = _config2.default.get('proxy');

/* istanbul ignore if */
if (!module.parent) {
    var port = _config2.default.get('port');
    var host = _config2.default.get('host');
    app.use(require('./middlewares/view').render(app));
    app.listen(port, host);
    console.log('server started at http://' + host + ':' + port);
}

// 静态资源缓存
function serve(prefix, filePath) {
    return staticCache(_path2.default.resolve(__dirname, filePath), {
        prefix: prefix,
        gzip: true,
        dynamic: true,
        maxAge: 60 * 60 * 24 * 30
    });
}

/// http://taobaofed.org/blog/2016/01/07/find-back-the-lost-es6-features-in-nodejs/   node 支持 es6