import { TXN_FAMILIES, TRANSACTIONS, SIGNERS, BLOCKS, STATE_ELEMENTS } from "../store/constants";

export default {
    LOCAL_STORAGE: {
        userToken: {
            type: String,
            default: null
        },
        username: {
            type: String,
            default: null
        },
        transactions: {
            type: Array,
            default: []
        },
        txnFamilies: {
            type: Array,
            default: []
        },
        signers: {
            type: Array,
            default: []
        },
        blocks: {
            type: Array,
            default: []
        },
        stateElements: {
            type: Array,
            default: []
        },
        [`${TRANSACTIONS}query`]: {
            type: Object,
            default: {}
        },
        [`${TXN_FAMILIES}query`]: {
            type: Object,
            default: {}
        },
        [`${SIGNERS}query`]: {
            type: Object,
            default: {}
        },
        [`${BLOCKS}query`]: {
            type: Object,
            default: {}
        },
        [`${STATE_ELEMENTS}query`]: {
            type: Object,
            default: {}
        },
    }
}