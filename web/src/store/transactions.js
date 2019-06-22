import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD
} from './constants'

export default {
    namespaced: true,
    state: {
        transactions: JSON.parse(localStorage.getItem('transactions')) || []
    },
    getters: {
        transactions: state => state.transactions
    },
    mutations: {
        [LOAD]: (state, transactions) => {
            state.transactions = transactions
        },
        [LOGOUT]: (state) => {
            state.transactions = []
        }
    },
    actions: {
        [LOAD]: ({commit, dispatch}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/transactions', data: query, method: 'GET' })
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
        }
    }
}
