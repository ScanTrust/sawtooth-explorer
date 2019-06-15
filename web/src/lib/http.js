import axios from 'axios'

import store from '@/store'
import messageCodes from './message-codes'
import { AUTH, LOGOUT } from '@/store/constants';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.response.use(function (res) {
   return new Promise(function (resolve, reject) {
        const data = res.data
        if (data && data.message)
            res.data.message = messageCodes[data.message] || messageCodes['unknown_error']
        resolve(res)
   }) 
}, function (err) {
    return new Promise(function (resolve, reject) {
        if (err.response) {
            const resp = err.response
            if (resp.status === 401 && err.config && !err.config.__isRetryRequest) {
                store.dispatch(AUTH, LOGOUT)
            } else if ([400, 422, 500].includes(resp.status) && resp.data && resp.data.message) {
                const data = resp.data
                err.response.data.message = messageCodes[data.message] || messageCodes['unknown_error']
            }
        }
        throw err;
    });
});

export default axiosInstance