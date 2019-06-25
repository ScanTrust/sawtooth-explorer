import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,
    
    LOGOUT,

    LOAD,
    ADD,
    EDIT,

    TXN_FAMILIES,
    UPDATE_FILTERS,
    UPDATE_QUERY,
} from './constants'
import { EventBus } from '@/lib/event-bus'

export default {
    namespaced: true,
    state: {
        txnFamilies: JSON.parse(localStorage.getItem('txnFamilies') || '[]'),
        query: JSON.parse(localStorage.getItem(`${TXN_FAMILIES}query`) || '{}'),
    },
    getters: {
        txnFamilies: state => state.txnFamilies,
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, txnFamilies) => {
            state.txnFamilies = txnFamilies
        },
        [LOGOUT]: (state) => {
            state.txnFamilies = []
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies', params: query || getters.query, method: 'GET' })
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
                        dispatch(LOAD)
                        resolve(resp)
                    })
                    .catch(err => {
                        EventBus.$emit(SNACKBAR, err.response.data)
                        reject(err)
                    })
            })
        },
        [EDIT]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/txnFamilies/edit', data, method: 'POST' })
                    .then(resp => {
                        EventBus.$emit(SNACKBAR, resp.data)
                        dispatch(LOAD)
                        resolve(resp)
                    })
                    .catch(err => {
                        EventBus.$emit(SNACKBAR, err.response.data)
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${TXN_FAMILIES}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
