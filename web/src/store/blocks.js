import Vue from 'vue'

import http from '@/lib/http'
import {
    LOGOUT,
    LOAD
} from './constants'
import { EventBus } from '@/lib/event-bus'

export default {
    namespaced: true,
    state: {
        blocks: localStorage.getItem('blocks') || []
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
