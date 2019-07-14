import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD,
    BLOCKS,
    UPDATE_FILTERS,
    UPDATE_QUERY,
    BLOCKS_GETTER_NAME,
} from './constants'

export default {
    namespaced: true,
    state: {
        blocks: JSON.parse(localStorage.getItem('blocks') || '[]'),
        query: JSON.parse(localStorage.getItem(`${BLOCKS}query`) || '{}'),
    },
    getters: {
        [BLOCKS_GETTER_NAME]: state => state.blocks,
        query: state => state.query,
    },
    mutations: {
        [LOAD]: (state, blocks) => {
            state.blocks = blocks
        },
        [LOGOUT]: (state) => {
            state.blocks = []
        },
        [UPDATE_QUERY]: (state, query) => {
            state.query = query
        }
    },
    actions: {
        [LOAD]: ({commit, getters}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/blocks', params: query || getters.query, method: 'GET' })
                    .then(resp => {
                        const blocks = resp.data.reverse()
                        Vue.storage.set('blocks', JSON.stringify(blocks))
                        commit(LOAD, blocks)
                        resolve(blocks)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        [UPDATE_FILTERS]: ({commit, dispatch}, filters) => {
            Vue.storage.set(`${BLOCKS}query`, JSON.stringify(filters))
            commit(UPDATE_QUERY, filters)
            dispatch(LOAD)
        }
    }
}
