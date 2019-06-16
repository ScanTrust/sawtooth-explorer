import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD
} from './constants'

export default {
    namespaced: true,
    state: {
        blocks: JSON.parse(localStorage.getItem('blocks')) || []
    },
    getters: {
        blocks: state => state.blocks
    },
    mutations: {
        [LOAD]: (state, blocks) => {
            state.blocks = blocks
        },
        [LOGOUT]: (state) => {
            state.blocks = []
        }
    },
    actions: {
        [LOAD]: ({commit, dispatch}, query) => {
            return new Promise((resolve, reject) => {
                http({ url: '/blocks', data: query, method: 'GET' })
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
        }
    }
}
