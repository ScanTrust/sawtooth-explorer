import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@/layouts/Auth.vue'
import Main from '@/layouts/Main.vue'
import Blocks from '@/views/Blocks.vue'
import Transactions from '@/views/Transactions.vue'
import StateElements from '@/views/StateElements.vue'
import Signers from '@/views/Signers.vue'
import TxnFamilies from '@/views/TxnFamilies.vue'
import Settings from '@/views/Settings.vue'
import store from '@/store'
import { AUTH } from '@/store/constants'
import {
  AUTH_PATH,
  ROOT_PATH,
  BLOCKS_PATH,
  SIGNERS_PATH,
  TXN_FAMILIES_PATH,
  TRANSACTIONS_PATH,
  STATE_PATH,
  SETTINGS_PATH,
} from './constants'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters[AUTH + 'isAuthenticated']) {
    next()
    return
  }
  next(ROOT_PATH)
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters[AUTH + 'isAuthenticated']) {
    next()
    return
  }
  next(AUTH_PATH)
}

export default new Router({
  routes: [
    {
      path: AUTH_PATH,
      name: 'auth',
      component: Auth,
      beforeEnter: ifNotAuthenticated
    }, {
      path: ROOT_PATH,
      name: 'main',
      component: Main,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: BLOCKS_PATH,
          component: Blocks
        }, {
          path: SIGNERS_PATH,
          component: Signers
        }, {
          path: TXN_FAMILIES_PATH,
          component: TxnFamilies
        }, {
          path: TRANSACTIONS_PATH,
          component: Transactions
        }, {
          path: STATE_PATH,
          component: StateElements
        }, {
          path: SETTINGS_PATH,
          component: Settings
        }
      ]
    }
  ]
})
