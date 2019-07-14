import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import signers from './signers'
import txnFamilies from './txn-families'
import blocks from './blocks'
import transactions from './transactions'
import stateElements from './state-elements'
import proto from './proto'
import {
    SIGNERS,
    TXN_FAMILIES,
    BLOCKS,
    STATE_ELEMENTS,
    TRANSACTIONS,
    PROTO,
    LOAD,
    FETCH_PROP_VALUE,
} from './constants'
import {
    comparisonOperatorToFunction,
} from '@/lib/common'

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {
        async [LOAD] ({dispatch}) {
            await dispatch(PROTO + LOAD),
            dispatch(SIGNERS + LOAD),
            dispatch(TXN_FAMILIES + LOAD),
            dispatch(BLOCKS + LOAD),
            dispatch(STATE_ELEMENTS + LOAD)
            dispatch(TRANSACTIONS + LOAD)
        },
        [FETCH_PROP_VALUE] ({getters}, {searchedEntityStoreNameSpace, searchConfig, data}) {
            // Need to fetch prop-value from store
            // using this searchConfig and data
            const entities = getters[searchedEntityStoreNameSpace + searchConfig.storeGetterName]
            const [storeEntityKey, comparisonOperator, detailedEntityKey] = searchConfig.storeWhereQuery.split(' ')
            return entities[searchConfig.multiple ? 'filter' : 'find'](entity => {
                return comparisonOperatorToFunction[comparisonOperator](
                    entity[storeEntityKey],
                    data[detailedEntityKey]
                )
            }) || { [storeEntityKey]: data[detailedEntityKey] }
            // Example of possible call above when
            // some values are substituted is
            // return this.signers.find(
            //     signer => signer.puplicKey == data.signerPublicKey)
        }
    },
    modules: {
        auth,
        signers,
        txnFamilies,
        blocks,
        transactions,
        stateElements,
        proto
    }
})
