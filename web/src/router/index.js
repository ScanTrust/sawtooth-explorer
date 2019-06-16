import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@/layouts/Auth.vue'
import Main from '@/layouts/Main.vue'
import Blocks from '@/views/Blocks.vue'
import Signers from '@/views/Signers.vue'
import TxnFamilies from '@/views/TxnFamilies.vue'
import store from '@/store'
import { AUTH } from '@/store/constants'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters[AUTH + 'isAuthenticated']) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters[AUTH + 'isAuthenticated']) {
    next()
    return
  }
  next('/auth')
}

export default new Router({
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      beforeEnter: ifNotAuthenticated
    }, {
      path: '/',
      name: 'main',
      component: Main,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'blocks',
          component: Blocks
        }, {
          path: 'signers',
          component: Signers
        }, {
          path: 'txnFamilies',
          component: TxnFamilies
        }
      ]
    }
  ]
})
