import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD
} from './constants'

export default {
    namespaced: true,
    state: {
        stateElements: JSON.parse(localStorage.getItem('stateElements')) || []
    },
    getters: {
        stateElements: state => state.stateElements
    },
    mutations: {
        [LOAD]: (state, stateElements) => {
            state.stateElements = stateElements
        },
        [LOGOUT]: (state) => {
            state.stateElements = []
        }
    },
    actions: {
        [LOAD]: ({commit, dispatch}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/stateElements', data: query, method: 'GET' })
                    .then(resp => {
                        const stateElements = resp.data.map(stateElement => {
                            stateElement.data = Buffer(stateElement.data).toString('base64')
                            stateElement.addressPrefix = stateElement.address.slice(0, 6)
                            return stateElement
                        })
                        Vue.storage.set('stateElements', JSON.stringify(stateElements))
                        commit(LOAD, stateElements)
                        resolve(stateElements)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        }
    }
}
