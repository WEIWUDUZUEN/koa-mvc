import Vue from 'vue'
import Router from 'vue-router'

import index from './pages/index'
import home from './pages/home'
import homeCategory from './pages/home/category/index'
// import layout from 'components/layout/index'

Vue.use(Router)

export function createRouter() {
  const router = new Router({
    mode: 'history',
    routes: [{
        name: '',
        path: '/',
        component: index
      },
      {
        name: 'home',
        path: '/home',
        component: home,
        children: [{
          name: 'home-category',
          path: 'category',
          component: homeCategory
        }]
      }
      // { path: '/log-out', component: logOut }
    ]
  })
  return router
}