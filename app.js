
import Koa from 'koa'
import path from 'path'
import config from 'config'
import koaJwt from 'koa-jwt'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import onerror from 'koa-onerror'
import favicon from 'koa-favicon'
import validate from 'koa-validate'
import pathToRegexp from 'path-to-regexp'
import staticCache from 'koa-static-cache'

import util from './util'
import logger from './util/logger'
import middleware from './middlewares'
import routerConfig from './router-config'

const app = module.exports = new Koa()

const uploadConf = config.get('upload')
const jwtSecret = config.get('jwt.secret')

util.init()
onerror(app)
validate(app)

app
    .use(middleware.ipFilter)
    .use(favicon(path.join(__dirname, '/public/images/logo.png')))
    .use(serve('/dist', './dist'))
    .use(serve('/public', './public'))
    .use(serve('/upload', path.resolve(__dirname, 'config', uploadConf.dir)))
    // .use(logger)
    .use(middleware.util)
    .use(cors({
        credentials: true,
        maxAge: 2592000
    }))
    // .use(koaJwt({
    //     secret: jwtSecret
    // }).unless((ctx) => { // 不需要 jwt 验证的接口
    //     if (/^\/api/.test(ctx.path)) {
    //         return pathToRegexp([
    //             '/api/login',
    //             '/api/register'
    //         ]).test(ctx.path)
    //     }
    //     return true
    // }))
    .use(koaBody({
        multipart: true
    }))
    .use(routerConfig.api.routes())
    .use(routerConfig.api.allowedMethods())
    .use(routerConfig.hxl.routes())
    .use(routerConfig.hxl.allowedMethods())

app.proxy = config.get('proxy')

/* istanbul ignore if */
if (!module.parent) {
    const port = config.get('port')
    const host = config.get('host')
    app.use(require('./middlewares/view').render(app))
    app.listen(port, host)
    console.log(`server started at http://${host}:${port}`)
}

// 静态资源缓存
function serve(prefix, filePath) {
    return staticCache(path.resolve(__dirname, filePath), {
        prefix: prefix,
        gzip: true,
        dynamic: true,
        maxAge: 60 * 60 * 24 * 30
    })
}

// 错误监听
async function exitHandler(ev, err) {
    if (err) {
        console.log(err.stack)
    } else {
        process.exit()
    }
}

;['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach(x => {
    process.on(x, exitHandler.bind(null, x))
})

/// http://taobaofed.org/blog/2016/01/07/find-back-the-lost-es6-features-in-nodejs/   node 支持 es6
/// https://blog.csdn.net/tingyugetc11/article/details/76850967  nodemon 和 babel-node 配合使用
/// https://github.com/yin-fan/todoList/blob/master/app.js 			JWT 认证 demo
/// https://www.cnblogs.com/kenkofox/p/8018476.html   vue ssr 服务端渲染