import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,
    
    LOGOUT,

    LOAD,
    ADD
} from './constants'
import { EventBus } from '@/lib/event-bus'

export default {
    namespaced: true,
    state: {
        txnFamilies: localStorage.getItem('txnFamilies') || []
    },
    getters: {
        txnFamilies: state => state.txnFamilies
    },
    mutations: {
        [LOAD]: (state, txnFamilies) => {
            state.txnFamilies = txnFamilies
        },
        [LOGOUT]: (state) => {
            state.txnFamilies = []
        }
    },
    actions: {
        [LOAD]: ({commit, dispatch}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies', data: query, method: 'GET' })
                    .then(resp => {
                        const txnFamilies = resp.data
                        Vue.storage.set('txnFamilies', JSON.stringify(txnFamilies))
                        commit(LOAD, txnFamilies)
                        resolve(txnFamilies)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [ADD]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies/add', data, method: 'POST'})
                    .then(resp => {
                        EventBus.$emit(SNACKBAR, resp.data)
                        resolve(resp)
                    })
                    .catch(err => {
                        EventBus.$emit(SNACKBAR, err.response.data)
                        reject(err)
                    })
            })
        }
    }
}
