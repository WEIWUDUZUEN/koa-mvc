import Vue from 'vue'

const ParabolaConstructor = Vue.extend(require('./parabola.vue'))

let getAnInstance = () => {
  return new ParabolaConstructor({
    el: document.createElement('div')
  })
}

let Parabola = (options = {}) => {
  let duration = options.duration || 3000

  let instance = getAnInstance()
  instance.start = options.start
  instance.end = options.end
  instance.isTrigger = options.isTrigger
  instance.top = options.top || 1
  instance.duration = options.duration || '500'
  instance.rate = options.rate || 1

  document.body.appendChild(instance.$el)
  Vue.nextTick(function () {
    instance.onParabolaFinish = () => {
      instance.$el.parentNode.removeChild(instance.$el)
      options.onParabolaFinish()
    }
  })
  return instance
}

const install = function (Vue) {
  Vue.$parabola = Vue.prototype.$parabola = Parabola
}

export default {
  install
}