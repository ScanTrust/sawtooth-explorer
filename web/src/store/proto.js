import Vue from 'vue'
import protobufjs from 'protobufjs'

import http from '@/lib/http'
import {
    LOAD,
    UPLOAD,
    DECODE,
    LOGOUT,
    SNACKBAR,
    SAVE_RULES,
    PROTO_TO_DECODER_GETTER_NAME,
    PROTO_MESSAGES_GETTER_NAME,
    TXN_FAMILY_PREFIX_TO_RULES_CONFIG_GETTER_NAME,
    TXN_FAMILY_PREFIX_TO_FILE_NAMES_GETTER_NAME,
} from './constants'
import { EventBus } from '@/lib/event-bus'

const RuleTypes = {
    ADDRESS_SLICE: 0,
    DATA_BYTE: 1,
}

export default {
    namespaced: true,
    state: {
        protoToDecoder: null,
        txnFamilyPrefixToFileNames: JSON.parse(localStorage.getItem('txnFamilyPrefixToFileNames') || '{}'),
        txnFamilyPrefixToRulesConfig: JSON.parse(localStorage.getItem('txnFamilyPrefixToRulesConfig') || '{}'),
        protoMessages: JSON.parse(localStorage.getItem('protoMessages') || '[]'),
    },
    getters: {
        [TXN_FAMILY_PREFIX_TO_FILE_NAMES_GETTER_NAME]: state => state.txnFamilyPrefixToFileNames,
        [PROTO_TO_DECODER_GETTER_NAME]: state => state.protoToDecoder,
        [PROTO_MESSAGES_GETTER_NAME]: state => state.protoMessages,
        [TXN_FAMILY_PREFIX_TO_RULES_CONFIG_GETTER_NAME]: state => state.txnFamilyPrefixToRulesConfig,
    },
    mutations: {
        [LOAD]: (state, {protoToDecoder, txnFamilyPrefixToFileNames, protoMessages, txnFamilyPrefixToRulesConfig}) => {
            state.protoToDecoder = protoToDecoder
            state.txnFamilyPrefixToFileNames = txnFamilyPrefixToFileNames
            state.txnFamilyPrefixToRulesConfig = txnFamilyPrefixToRulesConfig
            state.protoMessages = protoMessages
        },
        [LOGOUT]: (state) => {
            state.protoToDecoder = null
            state.txnFamilyPrefixToFileNames = null
            state.txnFamilyPrefixToRulesConfig = null
            state.protoMessages = null
        },
    },
    actions: {
        [UPLOAD]: ({dispatch}, {files, txnFamilyPrefix}) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('txnFamilyPrefix', txnFamilyPrefix)
                for (let i = 0; i != files.length; i++) {
                    formData.append(`files[${i}]`, files[i])
                }
                http.post('/proto', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(async resp => {
                    EventBus.$emit(SNACKBAR, resp.data)
                    await dispatch(LOAD)
                    resolve(resp)  
                }).catch(err => {
                    reject(err)
                })
            })
        },
        [SAVE_RULES]: ({dispatch}, {txnFamilyPrefix, rules, transactionPayloadProtoName}) => {
            return new Promise(async (resolve, reject) => {
                const messages = {}
                rules.forEach(rule => {
                    const protoName = rule.protoName
                    delete rule.protoName
                    messages[protoName] = messages[protoName] || []
                    messages[protoName].push(rule)
                })
                const res = await http.post('/proto/messages', {
                    txnFamilyPrefix,
                    messages,
                    transactionPayloadProtoName
                })
                await dispatch(LOAD)
                resolve(res)
            })
        },
        [LOAD]: ({commit}) => {
            return new Promise(async (resolve, reject) => {
                const messagesRes = await http({ url: '/proto/messages', method: 'GET' }).catch(err => reject(err))
                Vue.storage.set('protoMessages', JSON.stringify(messagesRes.data))
                const protosRes = await http({ url: '/proto', method: 'GET' }).catch(err => reject(err))
                const { txnFamilyPrefixToFileNames, descriptor, txnFamilyPrefixToRulesConfig } = protosRes.data
                Vue.storage.set('txnFamilyPrefixToFileNames', JSON.stringify(txnFamilyPrefixToFileNames))
                Vue.storage.set('txnFamilyPrefixToRulesConfig', JSON.stringify(txnFamilyPrefixToRulesConfig))
                const protoFromJSON = protobufjs.Root.fromJSON(descriptor)
                const protoToDecoder = {}
                Object.keys(descriptor.nested).forEach(protoName => {
                    if (protoFromJSON[protoName])
                        protoToDecoder[protoName] = protoFromJSON[protoName]
                })
                commit(LOAD, {protoToDecoder, txnFamilyPrefixToFileNames, txnFamilyPrefixToRulesConfig, protoMessages: messagesRes.data})
                resolve({protoToDecoder, txnFamilyPrefixToFileNames, txnFamilyPrefixToRulesConfig, protoMessages: messagesRes.data})
            })
        },
        [DECODE]: ({getters}, {isTransaction, entities}) => {
            return new Promise((resolve, reject) => {
                const { protoToDecoder, txnFamilyPrefixToRulesConfig } = getters
                if (!Array.isArray(entities))
                    entities = [entities]
                const decodedEntities = entities.map(entity => {
                    let familyPrefix = entity.familyPrefix
                    let entityDecodedField = "payloadDecoded"
                    let entityEncodedField = "payload"
                    if (!isTransaction) {
                        familyPrefix = entity.addressPrefix
                        entityDecodedField = "decodedData"
                        entityEncodedField = "data"
                    }
                    const rulesConfig = txnFamilyPrefixToRulesConfig[familyPrefix]
                    if (rulesConfig) {
                        let protoName = rulesConfig.transactionPayloadProtoName
                        if (!isTransaction) {
                            protoName = getProtoNameByRules(rulesConfig, entity)
                        }
                        if (protoName) {
                            const protoDecoder = protoToDecoder[protoName]
                            const encodedBuffer = base64ToBinarySegment(entity[entityEncodedField])
                            entity[entityDecodedField] = protoDecoder.decode(encodedBuffer)
                        }
                    }
                    return entity
                })
                return resolve(decodedEntities)
            })
        },
    }
}

function getProtoNameByRules (rulesConfig, stateElement) {
    if (!stateElement.address || !stateElement.data)
        throw new Error("Wrong state element format: 'address' or 'data' field is missing")
    return Object.keys(rulesConfig.protoNameToRules).find(protoName => {
        const rules = rulesConfig.protoNameToRules[protoName]
        return !!rules.find(rule => isRuleFollowed(rule, stateElement))
    })
}

function isRuleFollowed (rule, stateElement) {
    if (rule.type == RuleTypes.ADDRESS_SLICE) {
        const slicedPart = stateElement.address.slice(rule.begin, rule.end)
        if (rule.minMax) {
            const slicedPartDecimal = parseInt(slicedPart, 16)
            return rule.minMax[0] <= slicedPartDecimal && slicedPartDecimal < rule.minMax[1]
        }
        if (rule.regEx) {
            return (new RegExp(rule.regEx)).test(slicedPart)
        }
        return false
    }
    if (rule.type == RuleTypes.DATA_BYTE) {
        const actualByte = base64ToBinarySegment(stateElement.data, rule.byteIndex, rule.byteIndex + 1)[0]
        return rule.minMax[0] <= actualByte && actualByte < rule.minMax[1]
    }
    return false
}

function base64ToBinarySegment (base64, begin, end) {
    const raw = atob(base64);
    const rawLength = raw.length;
    begin = begin || 0
    end = end || rawLength
    let array = new Uint8Array(new ArrayBuffer(end - begin));
    for (let i = begin; i < end; i++) {
        array[i - begin] = raw.charCodeAt(i);
    }
    return array;
}
