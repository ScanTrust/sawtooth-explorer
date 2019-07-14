// vuex store events
export const AUTH = 'auth/'
export const SIGNERS = 'signers/'
export const TXN_FAMILIES = 'txnFamilies/'
export const BLOCKS = 'blocks/'
export const STATE_ELEMENTS = 'stateElements/'
export const TRANSACTIONS = 'transactions/'
export const PROTO = 'proto/'

export const LOGIN = 'LOGIN'
export const REGISTER = 'REGISTER'
export const SUCCESS = 'SUCCESS'
export const ERROR = 'ERROR'
export const LOGOUT = 'LOGOUT'
export const LOAD = 'LOAD'
export const UPLOAD = 'UPLOAD'
export const DECODE = 'DECODE'
export const ADD = 'ADD'
export const EDIT = 'EDIT'
export const UPDATE_QUERY = 'UPDATE_QUERY'
export const UPDATE_FILTERS = 'UPDATE_FILTERS'
export const SAVE_RULES = 'SAVE_RULES'
export const FETCH_PROP_VALUE = 'FETCH_PROP_VALUE'

// proto decoding rules' types
export const ADDRESS_SLICE = 'ADDRESS_SLICE'
export const DATA_BYTE = 'DATA_BYTE'

// event-bus.js events
export const SNACKBAR = 'SNACKBAR'

export const SHOW_DETAILS = 'SHOW_DETAILS'
export const SHOW_EDIT = 'SHOW_EDIT'
export const SHOW_ADD = 'SHOW_ADD'
export const SHOW_SIGNER_ADD = 'SHOW_SIGNER_ADD'
export const SHOW_TXN_FAMILY_ADD = 'SHOW_TXN_FAMILY_ADD'
export const SHOW_FILTERS = 'SHOW_FILTERS'
export const RESET_FILTERS = 'RESET_FILTERS'

// types for SHOW_DETAILS
export const TRANSACTION = 'TRANSACTION'
export const BLOCK = 'BLOCK'
export const STATE_ELEMENT = 'STATE_ELEMENT'
export const SIGNER = 'SIGNER'
export const TXN_FAMILY = 'TXN_FAMILY'

// store getters names
export const SIGNERS_GETTER_NAME = 'signers'
export const TXN_FAMILIES_GETTER_NAME = 'txnFamilies'
export const BLOCKS_GETTER_NAME = 'blocks'
export const TRANSACTIONS_GETTER_NAME = 'transactions'
export const STATE_ELEMENTS_GETTER_NAME = 'stateElements'
export const PROTO_TO_DECODER_GETTER_NAME = 'protoToDecoder'
export const PROTO_MESSAGES_GETTER_NAME = 'protoMessages'
export const TXN_FAMILY_PREFIX_TO_RULES_CONFIG_GETTER_NAME = 'txnFamilyPrefixToRulesConfig'
export const TXN_FAMILY_PREFIX_TO_FILE_NAMES_GETTER_NAME = 'txnFamilyPrefixToFileNames'

// filters' components' names
export const BLOCKS_FILTERS_COMPONENT = 'blocks-filters'
export const SIGNERS_FILTERS_COMPONENT = 'signers-filters'
export const TXN_FAMILIES_FILTERS_COMPONENT = 'txn-families-filters'
export const TRANSACTIONS_FILTERS_COMPONENT = 'transactions-filters'
export const STATE_ELEMENTS_FILTERS_COMPONENT = 'state-elements-filters'
