import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    TRANSACTIONS,
    UPDATE_FILTERS,
    UPDATE_QUERY,
} from './constants'

export default {
    namespaced: true,
    state: {
        transactions: JSON.parse(localStorage.getItem('transactions')) || [],
        query: JSON.parse(localStorage.getItem(`${TRANSACTIONS}query`)) || {},
    },
    getters: {
        transactions: state => state.transactions,
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
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/transactions', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const transactions = resp.data.reverse().map(txn => {
                            txn.payload = Buffer(txn.payload).toString('base64')
                            return txn
                        })
                        Vue.storage.set('transactions', JSON.stringify(transactions))
                        commit(LOAD, transactions)
                        resolve(transactions)
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
