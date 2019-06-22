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
            default: null
        },
        txnFamilies: {
            type: Array,
            default: null
        },
        signers: {
            type: Array,
            default: null
        },
        blocks: {
            type: Array,
            default: null
        },
        stateElements: {
            type: Array,
            default: null
        }
    }
}