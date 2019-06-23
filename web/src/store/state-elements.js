import Vue from 'vue'
import moment from 'moment'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    UPDATE_QUERY,
    UPDATE_FILTERS,

    STATE_ELEMENTS,
    RESET_FILTERS,
} from './constants'

export default {
    namespaced: true,
    state: {
        stateElements: JSON.parse(localStorage.getItem('stateElements')) || [],
        query: JSON.parse(localStorage.getItem(`${STATE_ELEMENTS}query`)) || {},
    },
    getters: {
        stateElements: state => state.stateElements,
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, stateElements) => {
            state.stateElements = stateElements
        },
        [LOGOUT]: (state) => {
            state.stateElements = []
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/stateElements', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const stateElements = resp.data.map(stateElement => {
                            stateElement.data = Buffer(stateElement.data).toString('base64')
                            stateElement.createdAt = moment(stateElement.createdAt).format('LLL')
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
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${STATE_ELEMENTS}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
