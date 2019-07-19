import Vue from 'vue'
import protobufjs from 'protobufjs'
import cbor from 'cbor'

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
    TRANSACTIONS,
    STATE_ELEMENTS,
    ENCODING_TYPES,
    TXN_FAMILY_PREFIX_TO_SETTING,
} from './constants'
import { EventBus } from '@/lib/event-bus'

const RuleTypes = {
    ADDRESS_SLICE: 0,
    DATA_BYTE: 1,
}

export default {
    namespaced: true,
    state: {
        txnFamilyPrefixToSettings: JSON.parse(localStorage.getItem('txnFamilyPrefixToSettings') || '{}'),
        protoToDecoder: null,
        txnFamilyPrefixToFileNames: JSON.parse(localStorage.getItem('txnFamilyPrefixToFileNames') || '{}'),
        txnFamilyPrefixToRulesConfig: JSON.parse(localStorage.getItem('txnFamilyPrefixToRulesConfig') || '{}'),
        protoMessages: JSON.parse(localStorage.getItem('protoMessages') || '[]'),
    },
    getters: {
        [TXN_FAMILY_PREFIX_TO_SETTING]: state => state.txnFamilyPrefixToSettings,
        [TXN_FAMILY_PREFIX_TO_FILE_NAMES_GETTER_NAME]: state => state.txnFamilyPrefixToFileNames,
        [PROTO_TO_DECODER_GETTER_NAME]: state => state.protoToDecoder,
        [PROTO_MESSAGES_GETTER_NAME]: state => state.protoMessages,
        [TXN_FAMILY_PREFIX_TO_RULES_CONFIG_GETTER_NAME]: state => state.txnFamilyPrefixToRulesConfig,
    },
    mutations: {
        [LOAD]: (state, {
            txnFamilyPrefixToSettings,
            protoToDecoder,
            txnFamilyPrefixToFileNames,
            protoMessages,
            txnFamilyPrefixToRulesConfig
        }) => {
            state.txnFamilyPrefixToSettings = txnFamilyPrefixToSettings
            state.protoToDecoder = protoToDecoder
            state.txnFamilyPrefixToFileNames = txnFamilyPrefixToFileNames
            state.txnFamilyPrefixToRulesConfig = txnFamilyPrefixToRulesConfig
            state.protoMessages = protoMessages
        },
        [LOGOUT]: (state) => {
            state.txnFamilyPrefixToSettings = null
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
        [SAVE_RULES]: ({dispatch}, {
            txnFamilyPrefix,
            rules,
            transactionPayloadProtoName,
            txnPayloadEncodingType,
            stateElementsEncodingType,
        }) => {
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
                    transactionPayloadProtoName,
                    txnPayloadEncodingType,
                    stateElementsEncodingType,
                })
                EventBus.$emit(SNACKBAR, res.data)
                await dispatch(LOAD)
                resolve(res)
            })
        },
        [LOAD]: ({commit, dispatch}) => {
            return new Promise(async (resolve, reject) => {
                const messagesRes = await http({ url: '/proto/messages', method: 'GET' })
                Vue.storage.set('protoMessages', JSON.stringify(messagesRes.data))
                const protosRes = await http({ url: '/proto', method: 'GET' })
                const {
                    descriptor,
                    txnFamilyPrefixToFileNames,
                    txnFamilyPrefixToRulesConfig,
                    txnFamilyPrefixToSettings,
                } = protosRes.data
                Vue.storage.set('txnFamilyPrefixToSettings', JSON.stringify(txnFamilyPrefixToSettings))
                Vue.storage.set('txnFamilyPrefixToFileNames', JSON.stringify(txnFamilyPrefixToFileNames))
                Vue.storage.set('txnFamilyPrefixToRulesConfig', JSON.stringify(txnFamilyPrefixToRulesConfig))
                const protoFromJSON = protobufjs.Root.fromJSON(descriptor)
                const protoToDecoder = {}
                Object.keys(descriptor.nested).forEach(protoName => {
                    if (protoFromJSON[protoName])
                        protoToDecoder[protoName] = protoFromJSON[protoName]
                })
                const res = {
                    txnFamilyPrefixToSettings,
                    protoToDecoder,
                    txnFamilyPrefixToFileNames,
                    txnFamilyPrefixToRulesConfig,
                    protoMessages: messagesRes.data
                }
                commit(LOAD, res)
                await Promise.all([
                    dispatch(TRANSACTIONS + LOAD, null, { root: true }),
                    dispatch(STATE_ELEMENTS + LOAD, null, { root: true })
                ])
                resolve(res)
            })
        },
        [DECODE]: ({getters}, {isTransaction, entities}) => {
            return new Promise(resolve => {
                const { protoToDecoder,
                        txnFamilyPrefixToRulesConfig,
                        txnFamilyPrefixToSettings } = getters
                if (!Array.isArray(entities))
                    entities = [entities]
                let decodedEntitiesAmount = 0
                const decodedEntities = entities.map(entity => {
                    let familyPrefix = entity.familyPrefix
                    let entityDecodedField = "payloadDecoded"
                    let entityEncodedField = "payload"
                    if (!isTransaction) {
                        familyPrefix = entity.addressPrefix
                        entityDecodedField = "decodedData"
                        entityEncodedField = "data"
                    }
                    const txnFamilySetting = txnFamilyPrefixToSettings[familyPrefix]
                    if (!txnFamilySetting)
                        return entity
                    let entityEncodingType = txnFamilySetting.txnPayloadEncodingType
                    if (!isTransaction)
                        entityEncodingType = txnFamilySetting.stateElementsEncodingType
                    if (entityEncodingType === ENCODING_TYPES.PROTO) {
                        entity = decodeProto(
                            entity,
                            { entityDecodedField, entityEncodedField, familyPrefix, isTransaction },
                            protoToDecoder,
                            txnFamilyPrefixToRulesConfig
                        )
                    } else if (entityEncodingType === ENCODING_TYPES.CBOR) {
                        entity = decodeCBOR(entity)
                    }
                    if (entity[entityDecodedField])
                        decodedEntitiesAmount++
                    return entity
                })
                if (decodedEntitiesAmount > 0) {
                    const entitiesLabel = isTransaction ? 'transactions' : 'state elements'
                    EventBus.$emit(SNACKBAR, {
                        message: `Just finished decoding ${decodedEntitiesAmount} ${entitiesLabel}`
                    })
                }
                return resolve(decodedEntities)
            })
        },
    }
}

function decodeProto (entity, entityInfo, protoToDecoder, txnFamilyPrefixToRulesConfig) {
    const {entityDecodedField, entityEncodedField, familyPrefix, isTransaction} = entityInfo
    const rulesConfig = txnFamilyPrefixToRulesConfig[familyPrefix]
    if (rulesConfig) {
        let protoName = rulesConfig.transactionPayloadProtoName
        if (!isTransaction) {
            protoName = getProtoNameByRules(rulesConfig, entity)
        }
        if (protoName) {
            const protoDecoder = protoToDecoder[protoName]
            if (protoDecoder) {
                const encodedBuffer = base64ToBinarySegment(entity[entityEncodedField])
                try {
                    entity[entityDecodedField] = protoDecoder.decode(encodedBuffer)
                } catch (error) {
                    console.log("Cannot decode entity:", error)
                }
            }
        }
    }
    return entity
}

function decodeCBOR (entity) {
    const encodedBuffer = base64ToBinarySegment(entity[entityEncodedField])
    try {
        entity[entityDecodedField] = cbor.decode(encodedBuffer)                                    
    } catch (error) {
        console.log("Cannot decode entity:", error)
    }
    return entity
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
