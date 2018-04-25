import Vue from 'vue'
import config from 'config'
import VueI18n from 'vue-i18n'
import { sync } from 'vuex-router-sync'
import ElementLocale from 'element-ui/lib/locale'


import '../assets/css/main.css'
import '../plugins/element-ui'

import enLocale from '../locale/en'
import zhLocale from '../locale/zh-CN'
import { createStore } from '../store'
import { createRouter } from '../router-config'
import axiosPlugin from '../plugins/axios'
import App from '../layouts/main'

if (typeof window !== 'undefined') {
  // Vue.use(require('v-click-outside'))
  Vue.use(require('vue-shortkey'), {
    prevent: ['input', 'textarea']
  })
}

Vue.use(axiosPlugin)

// Vue.use(VueLocalStorage, { namespace: config.storageNamespace })
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN', // Vue.ls.get('locale') ||
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      ...zhLocale
    },
    'en': {
      ...enLocale
    }
  }
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

Vue.mixin({
  data () {
    return {
      pageAnimated: false
    }
  },
  mounted () {
    this.pageAnimated = true
  }
})

export function createApp () {
  const store = createStore()
  const router = createRouter()
  sync(store, router)
  // initAPI(router)
  const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  })
  return { app, router, store }
}
