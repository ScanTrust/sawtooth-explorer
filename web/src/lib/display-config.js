import {
    SIGNER,
    SIGNERS,
    TXN_FAMILY,
    TXN_FAMILIES,
    TRANSACTION,
    TRANSACTIONS,
    BLOCK,
    BLOCKS,
    STATE_ELEMENT,
    STATE_ELEMENTS,

    SIGNERS_GETTER_NAME,
    TXN_FAMILIES_GETTER_NAME,
    BLOCKS_GETTER_NAME,
    TRANSACTIONS_GETTER_NAME,
    STATE_ELEMENTS_GETTER_NAME,

    AUTH_FILTERS_COMPONENT,
    ROOT_FILTERS_COMPONENT,
    BLOCKS_FILTERS_COMPONENT,
    SIGNERS_FILTERS_COMPONENT,
    TXN_FAMILIES_FILTERS_COMPONENT,
    TRANSACTIONS_FILTERS_COMPONENT,
    STATE_ELEMENTS_FILTERS_COMPONENT,
} from '@/store/constants'
import {
    BLOCKS_PATH,
    SIGNERS_PATH,
    TXN_FAMILIES_PATH,
    TRANSACTIONS_PATH,
    STATE_PATH,
} from '@/router/constants'
import { rules } from '@/lib/validation-rules'

export const typeToStoreNamespace = {
    [TRANSACTION]: TRANSACTIONS,
    [BLOCK]: BLOCKS,
    [SIGNER]: SIGNERS,
    [TXN_FAMILY]: TXN_FAMILIES,
    [STATE_ELEMENT]: STATE_ELEMENTS,
}

export const tilesConfig = {
    [TXN_FAMILY]: {
        title: 'addressPrefix',
        subTitle: 'label',
    },
    [SIGNER]: {
        avatar: 'publicKey',
        title: 'label'
    },
    [BLOCK]: {
        avatar: 'id',
        title: 'id',
    },
    [TRANSACTION]: {
        avatar: 'id',
        title: 'payload'
    },
    [STATE_ELEMENT]: {
        avatar: 'address',
        title: 'data'
    },
}

const signerBaseSearchConfig = { // config used in search of the required prop
    entityKey: 'signerPublicKey',
    searchedEntityKey: 'publicKey',
}

const blockBaseSearchConfig = {
    entityKey: 'blockId',
    searchedEntityKey: 'id',
}

export const entityNameToConfig = {
    [BLOCK]: {
        title: 'Block',
        fieldNameToLabel: {
            id: 'Id',
            num: 'Number',
            previousBlockId: 'Previous block id',
            stateHash: 'State hash',
            signerPublicKey: 'Signer',
            transactions: 'Transactions',
            stateElements: 'State Elements',
        },
        fieldNameToEntityName: {
            signerPublicKey: SIGNER,
            transactions: TRANSACTIONS,
            stateElements: STATE_ELEMENTS,
        },
        tileSlotConfig: {
            tagName: 'entity-tile',
            getterName: BLOCKS_GETTER_NAME,
            detailsType: BLOCK,
            propNameToSearchConfig: {
                entity: {
                    [STATE_ELEMENT]: blockBaseSearchConfig,
                    [TRANSACTION]: blockBaseSearchConfig,
                }
            },
        }
    },
    [TRANSACTION]: {
        title: 'Transaction',
        fieldNameToLabel: {
            id: 'Id',
            batchId: 'Batch id',
            payload: 'Payload',
            blockId: 'Block id',
            signerPublicKey: 'Signer',
        },
        fieldNameToEntityName: {
            blockId: BLOCK,
            signerPublicKey: SIGNER,
        },
    },
    [TRANSACTIONS]: {
        tileSlotConfig: {
            tagName: 'entities-list',
            getterName: TRANSACTIONS_GETTER_NAME,
            detailsType: TRANSACTION,
            propNameToSearchConfig: {
                entities: {
                    [BLOCK]: {
                        entityKey: 'id',
                        searchedEntityKey: 'blockId',
                        multiple: true
                    },
                }
            },
        }
    },
    [STATE_ELEMENT]: {
        title: 'State Element',
        fieldNameToLabel: {
            address: 'Address',
            data: 'Data',
            createdAt: 'Created At',
            block: 'Block',
            txnFamily: 'Transaction Family',
        },
        fieldNameToEntityName: {
            block: BLOCK,
            txnFamily: TXN_FAMILY,
        },
    },
    [STATE_ELEMENTS]: {
        tileSlotConfig: {
            tagName: 'entities-list',
            detailsType: STATE_ELEMENT,
            getterName: STATE_ELEMENTS_GETTER_NAME,
            propNameToSearchConfig: {
                entities: {
                    [BLOCK]: {
                        // e.g. for this tileSlot,
                        // searching for a value to pass it to
                        // its prop called 'entities',
                        // for if it's in BLOCK's details,
                        // use this tileSlot's getterName to get list of
                        // entities from vuex store;
                        // compare their searchedEntityKey's value
                        // to entityKey's value of detailed(!) entity
                        // iterating over these entities;
                        // according to multiple do this with
                        // either 'filter', or 'find' js array methods
                        entityKey: 'id',
                        searchedEntityKey: 'blockId',
                        multiple: true
                    },
                }
            },
        }
    },
    [SIGNER]: {
        title: 'Signer',
        fieldNameToLabel: {
            publicKey: 'Public key',
            label: 'Label',
            txnsAmount: 'Transactions Signed',
            blocksAmount: 'Blocks Signed',
        },
        editableFields: [{
            name: 'label',
            rules: [rules.required, rules.minLength(4)]
        }],
        tileSlotConfig: {
            tagName: 'entity-tile',
            getterName: SIGNERS_GETTER_NAME,
            detailsType: SIGNER,
            propNameToSearchConfig: {
                entity: {
                    [BLOCK]: signerBaseSearchConfig,
                    [TRANSACTION]: signerBaseSearchConfig,
                }
            },
        }
    },
    [TXN_FAMILY]: {
        title: 'Transaction Family',
        fieldNameToLabel: {
            addressPrefix: 'Address prefix',
            label: 'Label',
        },
        editableFields: [{
            name: 'label',
            rules: [rules.required, rules.minLength(4)]
        }],
        tileSlotConfig: {
            tagName: 'entity-tile',
            detailsType: TXN_FAMILY,
            getterName: TXN_FAMILIES_GETTER_NAME,
            propNameToSearchConfig: {
                entity: {
                    [STATE_ELEMENT]: {
                        entityKey: 'addressPrefix',
                        searchedEntityKey: 'addressPrefix',
                    }
                }
            },
        }
    }
}

export const routePathToFiltersComponent = {
    [BLOCKS_PATH]: BLOCKS_FILTERS_COMPONENT,
    [SIGNERS_PATH]: SIGNERS_FILTERS_COMPONENT,
    [TXN_FAMILIES_PATH]: TXN_FAMILIES_FILTERS_COMPONENT,
    [TRANSACTIONS_PATH]: TRANSACTIONS_FILTERS_COMPONENT,
    [STATE_PATH]: STATE_ELEMENTS_FILTERS_COMPONENT,
}

export const routePathToStoreNamespace = {
    [TRANSACTIONS_PATH]: TRANSACTIONS,
    [BLOCKS_PATH]: BLOCKS,
    [SIGNERS_PATH]: SIGNERS,
    [TXN_FAMILIES_PATH]: TXN_FAMILIES,
    [STATE_PATH]: STATE_ELEMENTS,
}
