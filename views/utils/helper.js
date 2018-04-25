import { clearInterval } from "timers";

export default {
    install(Vue, options) {
        Vue.prototype.$helper = {
            /**
             * 格式化数量单位
             */
            fromtUnit : ((unit) => (num, index = 2) => {
                let number = parseFloat(num)
                if (number == 0) return num
                let unitKeys = Object.keys(unit)
                let unitVals = unitKeys.map( x => number / Math.pow(10, unit[x]))
                let key =  unitVals.findIndex( x => x > 1)
                let totalCount = unitVals[key] % 1 === 0 
                    ? unitVals[key] 
                    : parseFloat(unitVals[key]).toFixed(index)
                    return `${parseFloat(isNaN(totalCount) ? 0 : totalCount)}${unitKeys[key] || ''}`
            })({'亿+': 8, '万+': 4, '千+': 3, '':0}),
            /**
             * 设置 document 滚动位置
             * @param {*} top 滚动值 
             * @param {*} dom 
             */
            setScrollTop(top, dom = document.documentElement, time = 300) {
                // var count = time / 15
                // var tops = top - dom.scrollY
                // var interval = setInterval(() => {
                //     top = tops / count
                //     if (top >= tops) {
                //         clearInterval(interval)
                //         return
                //     }
                //     dom.scrollTop = dom.scrollY + top
                //     -- count
                // }, 15)
                return typeof top == 'number' && (dom.scrollTop = top)
            },
            isEmpty(value) {
                switch (typeof value) {
                    case 'string':
                        return value.replace(/(^\s*)|(\s*$)/g,'') === ''
                    case 'number':
                        return value < 0
                    case undefined:
                        return true
                }
                return false
            },
            // 事件的绑定（兼容）
            // W3C addEventListener
            // IE attachEvent
            bindEvent(obj, type, fn, bubble = false) {
                !Array.isArray(obj) && (obj = [obj])
                obj.forEach(element => {
                    // 2.	开始判断浏览器
                    if (typeof element.addEventListener != 'undefined') {
                        element.addEventListener(type, fn, bubble) // W3C
                    } else {
                        element.attachEvent('on'+type, fn) // IE
                    }
                })
                return obj
            },
            // 兼容性的删除事件的绑定
            // W3C 	removeEventListener
            // IE	detachEvent
		    removeEvent(obj, type, fn) {
                !Array.isArray(obj) && (obj = [obj])
                obj.forEach(element => {
                    if (typeof element.removeEventListener == 'function') { // 判断浏览器
                        element.removeEventListener(type, fn) // W3C
                    } else {
                        element.detachEvent('on'+type, fn); // IE
                    }
                })
                return obj
            },
            css(obj, style, value) {
                if (!obj) return obj
                let rupper = /([A-Z]|^ms)/g
                if (Array.isArray(obj)) {
                    let vms = new Array()
                    for (let vm of obj) {
                        vms.push(this.css(vm, style, value))
                    }
                    return vms
                }
                if (new Object(style) === style) {
                    for (let key in style) {
                        let val = style[key]
                        key = key.replace(rupper, "-$1").toLowerCase()
                        if (obj.$el) {
                            obj.$el.style[key] = val
                            continue
                        }
                        obj.style[key] = val
                    }
                } else if (typeof style === 'string') {
                    style = style.replace(rupper, "-$1").toLowerCase();
                    if (value === undefined) {
                        let val = obj.style[style]
                        return val ? val : this.getStyle(obj, style)
                    }
                    if (obj.$el) {
                        obj.$el.style[style] = value
                    } else {
                        obj.style[style] = value
                    }   
                }
                return obj
            },
            getStyle(obj, attr){  
                if(window.getComputedStyle){  
                    return window.getComputedStyle(obj, false)[attr];  
                }else{  
                    return obj.currentStyle[attr];  
                }  
            },
            toUpperCaseAll(str, stat = false) {
                let index = 0
                return str.toLowerCase().replace(/( |-|_|^)[a-z]/g, (val) => {
                    val = val.replace(/( |-|_|^)/g, '')
                    return (index ++ || stat) ? val.toUpperCase() : val.toLowerCase()
                })
            },
            mbStrlen(str) {
                return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
            },
            // RGB颜色转换为十六进制
            // colorHex(that) {
            //     //十六进制颜色值的正则表达式
            //     var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            //     // 如果是rgb颜色表示
            //     if (/^(rgb|RGB)/.test(that)) {
            //         var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            //         var strHex = "#";
            //         for (var i=0; i<aColor.length; i++) {
            //             var hex = Number(aColor[i]).toString(16);
            //             // if (hex === "0") {
            //             //     hex += hex;    
            //             // }
            //             hex = Number(aColor[i]) < 16 ? '0' + hex : hex;
            //             strHex += hex;
            //         }
            //         if (strHex.length !== 7) {
            //             strHex = that;    
            //         }
            //         return strHex;
            //     } else if (reg.test(that)) {
            //         var aNum = that.replace(/#/,"").split("");
            //         if (aNum.length === 6) {
            //             return that;    
            //         } else if(aNum.length === 3) {
            //             var numHex = "#";
            //             for (var i=0; i<aNum.length; i+=1) {
            //                 numHex += (aNum[i] + aNum[i]);
            //             }
            //             return numHex;
            //         }
            //     }
            //     return that;
            // },
            colorHex (value) {
                var color = value.replace(/[^\d,]/g, '').replace(/(\d+)/g, function(s, s1) {
                    return parseInt(s1).toString(16);
                });
                return '#'+ color.replace(/,/g, '').toUpperCase();
            },
            colorRgb(that, opacity) {
                var sColor = that.toLowerCase();
                //十六进制颜色值的正则表达式
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                // 如果是16进制颜色
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        var sColorNew = "#";
                        for (var i=1; i<4; i+=1) {
                            sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for (var i=1; i<7; i+=2) {
                        sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
                    }
                    return typeof opacity === 'number' 
                        ? `rgba(${sColorChange.join(",")},${opacity})` 
                        : "RGB(" + sColorChange.join(",") + ")";
                }
                return sColor;
            },
            /**
             * HSL颜色值转换为RGB. 
             * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
             * h, s, 和 l 设定在 [0, 1] 之间
             * 返回的 r, g, 和 b 在 [0, 255]之间
             *
             * @param   Number  h       色相
             * @param   Number  s       饱和度
             * @param   Number  l       亮度
             * @return  Array           RGB色值数值
             */
            hslToRgb(h, s, l) {
                var r, g, b;
                if(s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = function hue2rgb(p, q, t) {
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }
                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            },
            /**
             * RGB 颜色值转换为 HSL.
             * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
             * r, g, 和 b 需要在 [0, 255] 范围内
             * 返回的 h, s, 和 l 在 [0, 1] 之间
             *
             * @param   Number  r       红色色值
             * @param   Number  g       绿色色值
             * @param   Number  b       蓝色色值
             * @return  Array           HSL各值数组
             */
            rgbToHsl(r, g, b) {
                r /= 255, g /= 255, b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min){ 
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch(max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                return [h, s, l];
            }
        }
    }
}