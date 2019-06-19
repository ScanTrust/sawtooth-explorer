import Vue from 'vue'

import http from '@/lib/http'
import {
    SNACKBAR,

    AUTH,
    LOGIN,
    REGISTER,
    SUCCESS,
    ERROR,
    LOGOUT,
    
    SIGNERS,
    TXN_FAMILIES,
    BLOCKS,
    TRANSACTIONS,
} from './constants'
import { EventBus } from '@/lib/event-bus.js';

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('userToken'), // Vue.storage is not there yet and VueLocalStorage is not usable here for some reason
        username: localStorage.getItem('username'),
        status: ''
    },
    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
    },
    mutations: {
        [LOGIN]: (state) => {
            state.status = 'loading'
        },
        [SUCCESS]: (state, {token, username}) => {
            state.status = 'success'
            state.token = token
            state.username = username
        },
        [ERROR]: (state) => {
            state.status = 'error'
        },
        [LOGOUT]: (state) => {
            state.token = ''
            state.username = ''
            state.status = ''
        }
    },
    actions: {
        [LOGIN]: ({commit, dispatch}, user) => {
            return new Promise((resolve, reject) => {
                commit(LOGIN)
                http({url: '/auth/login', data: user, method: 'POST' })
                    .then(resp => {
                        let {token, username} = resp.data
                        token = "Bearer " + token
                        Vue.storage.set('userToken', token)
                        Vue.storage.set('username', username)
                        http.defaults.headers.common['Authorization'] = token
                        commit(SUCCESS, {token, username})
                        resolve(resp)
                    })
                    .catch(err => {
                        commit(ERROR, err)
                        EventBus.$emit(SNACKBAR, err.response.data)
                        reject(err)
                    })
            })
        },
        [REGISTER]: ({commit, dispatch}, user) => {
            return new Promise((resolve, reject) => {
                http({url: '/auth/register', data: user, method: 'POST' })
                    .then(resp => {
                        resolve(resp)
                    })
                    .catch(err => {
                        EventBus.$emit(SNACKBAR, err.response.data)
                        reject(err)
                    })
            })
        },
        [LOGOUT]: ({commit, dispatch}) => {
            return new Promise((resolve, reject) => {
                commit(LOGOUT)
                commit(SIGNERS + LOGOUT, null, { root: true })
                commit(TXN_FAMILIES + LOGOUT, null, { root: true })
                commit(BLOCKS + LOGOUT, null, { root: true })
                commit(TRANSACTIONS + LOGOUT, null, { root: true })
                Vue.storage.set('userToken', '')
                delete http.defaults.headers.common['Authorization']
                resolve()
            })
        }
    }
}
