import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'
import blocks from './blocks'

import { AUTH, BLOCKS, SIGNERS, TXN_FAMILIES, LOGOUT } from './constants'
const modules = [AUTH, BLOCKS, SIGNERS, TXN_FAMILIES]

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        signers,
        txnFamilies,
        blocks,
        actions: {
            [LOGOUT]: ({commit, dispatch}) => {
                modules.forEach(m => {
                    dispatch(m + LOGOUT)
                })
            }
        }
    }
})
