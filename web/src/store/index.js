import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'
import blocks from './blocks'
import transactions from './transactions'
import stateElements from './state-elements'
import {
    SIGNERS,
    TXN_FAMILIES,
    BLOCKS,
    STATE_ELEMENTS,
    TRANSACTIONS,
    LOAD,
} from './constants'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        [LOAD]: ({dispatch}) => {
            dispatch(SIGNERS + LOAD)
            dispatch(TXN_FAMILIES + LOAD)
            dispatch(BLOCKS + LOAD)
            dispatch(STATE_ELEMENTS + LOAD)
            dispatch(TRANSACTIONS + LOAD)
        }
    },
    modules: {
        auth,
        signers,
        txnFamilies,
        blocks,
        transactions,
        stateElements
    }
})
