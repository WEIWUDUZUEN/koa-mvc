'use strict'

import { isObject, get, has, merge } from 'lodash/fp'

/**
 * 数据格式
 * @type {response}
 */
const response = {
    data: {},
    init () {
    },
    run() {
        this.init(
            this.data,
            has(this.data, 'info')
                ? 'info'
                : 'list',
            this.data.message,
            this.data.code
        )
        this.data.success = this.data.code === 200
        return {
            payload: {
                ... this.data
            }
        }
    }
}

let responseData = {}

/**
 * 是否是函数
 * @param func
 * @returns {boolean}
 */
export const isFunction  = function (func) {
    return typeof func === 'function'
}

/**
 * 格式化返回值
 * @param info
 * @param message
 * @param code
 * @param callable
 */
export const formatResponse = function (info = '', message = '操作成功', code = 200, callable = null) {
    setFormatResponse({info}, message, code, callable)
    return getFormatResponse()
}

/**
 * 返回列表
 * @param list
 * @param message
 * @param code
 * @param callable
 */
export const formatResponseList = function (list = '', message = '查询列表', code = 200, callable = null) {
    setFormatResponse({list}, message, code, callable)
    return getFormatResponse()
}

/**
 * 获取 list
 * @param data
 * @returns {string|Array|{}}
 */
export const getFormatResponseList = function (data = null) {
    return get(responseData, 'data.list', {})
}

/**
 * 获取 info
 * @param data
 * @returns {*|string|info|{sex, age}|string|{}}
 */
export const getFormatResponseInfo = function (data = null) {
    return get(responseData, 'data.info', {})
}

/**
 * 设置 Response
 * @param data
 * @param message
 * @param code
 * @param callable
 * @returns {*}
 */
const setFormatResponse = function (data = {}, message = '操作成功', code = 200, callable = null) {
    if (isFunction(code)) {
        response.init = code.bind(response)
        code = 200
    } else if (isFunction(callable)) {
        response.init = callable.bind(response)
    }
    response.data = isObject(data)
        ? merge({ message, code }, data)
        : data
}

/**
 * 获取 response
 * @returns {*}
 */
const getFormatResponse = function () {
    return responseData = response.run()
}

export default {
    isFunction,
    formatResponse,
    formatResponseList,
    getFormatResponseList,
    getFormatResponseInfo
}