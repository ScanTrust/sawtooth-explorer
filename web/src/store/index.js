import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'
import blocks from './blocks'
import transactions from './transactions'

import { AUTH, BLOCKS, TRANSACTIONS, SIGNERS, TXN_FAMILIES, LOGOUT } from './constants'
const modules = [AUTH, BLOCKS, TRANSACTIONS, SIGNERS, TXN_FAMILIES]

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        signers,
        txnFamilies,
        blocks,
        transactions
    }
})
