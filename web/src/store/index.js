import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        signers,
        txnFamilies
    }
})
