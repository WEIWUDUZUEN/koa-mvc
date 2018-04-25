'use strict'

import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import config from 'config'
import Router from 'koa-router'
import restc from 'restc'
import ratelimit from 'koa-ratelimit'
import baseUtil from './util'
import middleware from './middlewares'
import helper from './util/helper'
import models from './models'

const apiRouter = new Router({
    prefix: '/api'
})

const HANDLER_PATH = path.resolve(__dirname, './controllers')
let CONTROLLERS = {}
let util = {
    helper, 
    format: helper.formatResponse,
    formats: helper.formatResponseList,
    getFormat: helper.getFormatResponseInfo,
    getFormats: helper.getFormatResponseList 
}
fs.readdirSync(HANDLER_PATH).forEach(x => {
    // CONTROLLERS[path.parse(x).name] = require(path.resolve(HANDLER_PATH, x))
    let actions = require(path.resolve(HANDLER_PATH, x))
    if (_.isObject(actions)) {
        _.each(actions, (fn, action) => {
            if (path.parse(x).name.toLocaleLowerCase() != 'index' 
                && action.toLocaleLowerCase() === 'default' 
                && helper.isFunction(fn)) {
                fn.call(util, apiRouter, util, models)
            }
        })
    }
})

// _.each(CONTROLLERS, (actions, controll) => {
//     if (_.isObject(actions)) {
//         _.each(actions, (fn, action) => {
//             if (controll.toLocaleLowerCase() != 'index') {
//                 let lastIndex = action.lastIndexOf('$')
//                 let method = action.substring(lastIndex).toLocaleLowerCase()
//                 if (_.isEmpty(method) || !['get', 'post', 'put', 'delete'].includes(method = method.substring(1))) {
//                     method = 'get'
//                 }
//                 apiRouter[method]('/' + [controll, action.substring(0, lastIndex)].join('/'), fn)
//             }
//         })
//     }
// })

apiRouter.all('*', (ctx) => {
    ctx.body = helper.formatResponse('未找到您的请求页面！', '404页面', 404)
})

const hxlRouter = new Router({
        prefix: '/hxl'
    })
    .all('*', middleware.hxlFilter, restc.koa2())

export default {
    api: apiRouter,
    hxl: hxlRouter
}