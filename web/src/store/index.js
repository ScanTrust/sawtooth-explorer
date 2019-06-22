import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'
import blocks from './blocks'
import transactions from './transactions'
import stateElements from './state-elements'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        signers,
        txnFamilies,
        blocks,
        transactions,
        stateElements
    }
})
