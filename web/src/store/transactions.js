import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    TRANSACTIONS,
    UPDATE_FILTERS,
    UPDATE_QUERY,
    TRANSACTIONS_GETTER_NAME,
    PROTO,
    DECODE,
} from './constants'

export default {
    namespaced: true,
    state: {
        transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
        query: JSON.parse(localStorage.getItem(`${TRANSACTIONS}query`) || '{}'),
    },
    getters: {
        [TRANSACTIONS_GETTER_NAME]: state => state.transactions,
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, transactions) => {
            state.transactions = transactions
        },
        [LOGOUT]: (state) => {
            state.transactions = []
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({dispatch, commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/transactions', params: query || getters.query, method: 'GET' })
                    .then(async resp => {
                        const transactions = resp.data.reverse()
                        const decodedTransactions = await dispatch(
                            PROTO + DECODE,
                            {isTransaction: true, entities: transactions},
                            {root: true}
                        )
                        Vue.storage.set('transactions', JSON.stringify(decodedTransactions))
                        commit(LOAD, decodedTransactions)
                        resolve(decodedTransactions)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${TRANSACTIONS}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
