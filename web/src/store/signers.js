import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,
    
    LOGOUT,

    LOAD,
    ADD,
    EDIT,

    SIGNERS,
    SIGNERS_GETTER_NAME,
    UPDATE_FILTERS,
    UPDATE_QUERY,
} from './constants'
import { EventBus } from '@/lib/event-bus'

export default {
    namespaced: true,
    state: {
        signers: JSON.parse(localStorage.getItem('signers') || '[]'),
        query: JSON.parse(localStorage.getItem(`${SIGNERS}query`) || '{}'),
    },
    getters: {
        [SIGNERS_GETTER_NAME]: state => state.signers,
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, signers) => {
            state.signers = signers
        },
        [LOGOUT]: (state) => {
            state.signers = []
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/signers', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const signers = resp.data
                        Vue.storage.set('signers', JSON.stringify(signers))
                        commit(LOAD, signers)
                        resolve(signers)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [ADD]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/signers/add', data, method: 'POST'})
                    .then(resp => {
                        EventBus.$emit(SNACKBAR, resp.data)
                        dispatch(LOAD)
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [EDIT]: ({commit, dispatch}, data) => {
            return new Promise((resolve, reject) => {
                http({ url: '/signers/edit', data, method: 'POST' })
                    .then(resp => {
                        EventBus.$emit(SNACKBAR, resp.data)
                        dispatch(LOAD)
                        resolve(resp)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${SIGNERS}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
