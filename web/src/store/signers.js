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
        signers: JSON.parse(localStorage.getItem('signers')) || []
    },
    getters: {
        signers: state => state.signers
    },
    mutations: {
        [LOAD]: (state, signers) => {
            state.signers = signers
        },
        [LOGOUT]: (state) => {
            state.signers = []
        }
    },
    actions: {
        [LOAD]: ({commit, dispatch}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/signers', data: query, method: 'GET' })
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
