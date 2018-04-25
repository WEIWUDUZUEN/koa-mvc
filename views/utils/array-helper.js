const _  = require('lodash')
export default {
    install(Vue, options) {
        Vue.prototype.$arrayHelper = {
            arange(start, end, key = false) {
                if (typeof start === 'string') {
                    start = start.charCodeAt(0)
                    let array = key ? {} : []
                    for (var i = 0; i < 26; i++) {
                        let val = String.fromCharCode(start++)
                        array[key ? val : i] = val
                        if (val === end) {
                            break
                        }
                    }
                    return array
                } else if (typeof end === 'string') {
                    end = end.charCodeAt(0)
                    if (start >= end) {
                        return [start]
                    }
                }
                return Array(end - start + 1).fill(0).map((v, i) => i + start)
            },
            remove(array, val) {
                var index = array.indexOf(val)
                if (index > -1) {
                    return array.splice(index, 1)
                }
            },
            indexOfs(array, val) {
                return Array.isArray(array) ? array.indexOf(val) : -1
            }
        }
    }
}