import Vue from 'vue'
import moment from 'moment'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    UPDATE_QUERY,
    UPDATE_FILTERS,

    STATE_ELEMENTS,
    STATE_ELEMENTS_GETTER_NAME,
    PROTO,
    DECODE,
} from './constants'

export default {
    namespaced: true,
    state: {
        stateElements: JSON.parse(localStorage.getItem('stateElements') || '[]'),
        query: JSON.parse(localStorage.getItem(`${STATE_ELEMENTS}query`) || '{}'),
    },
    getters: {
        [STATE_ELEMENTS_GETTER_NAME]: state => state.stateElements,
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
        [LOAD]: ({commit, dispatch, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/stateElements', params: query || getters.query, method: 'GET' })
                    .then(async resp => {
                        const stateElements = resp.data.map(stateElement => {
                            if (stateElement.createdAt)
                                stateElement.createdAt = moment(stateElement.createdAt).format('LLL')
                            stateElement.addressPrefix = stateElement.address.slice(0, 6)
                            return stateElement
                        })
                        const decodedStateElements = await dispatch(
                            PROTO + DECODE,
                            {isTransaction: false, entities: stateElements},
                            {root: true}
                        )
                        Vue.storage.set('stateElements', JSON.stringify(decodedStateElements))
                        commit(LOAD, decodedStateElements)
                        resolve(decodedStateElements)
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
