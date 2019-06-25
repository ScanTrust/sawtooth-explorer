import axios from 'axios'

import store from '@/store'
import messageCodes from './message-codes'
import { AUTH, LOGOUT } from '@/store/constants';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.response.use(
    function (res) {
        return new Promise(function (resolve, reject) {
            const data = res.data
            if (data && data.message)
                res.data.message = messageCodes[data.message] || messageCodes['unknown_error']
            resolve(res)
        })
    },
    function (err) {
        return new Promise(function (resolve, reject) {
            if (!err.response) {
                err.response = {data: {ok: false, message: 'no_response_from_server'}}
            }
            const resp = err.response
            if (resp.status === 401) {
                store.dispatch(AUTH + LOGOUT)
            }
            if (resp.data && resp.data.message) {
                const data = resp.data
                err.response.data.message = messageCodes[data.message] || messageCodes['unknown_error']
            }
            throw err;
        })
    }
);

export default axiosInstance