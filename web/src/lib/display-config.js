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
    getterName: SIGNERS_GETTER_NAME,
    entityKey: 'signerPublicKey',
    searchedEntityKey: 'publicKey',
}

const signerSearchConfigFor = {
    [BLOCK]: signerBaseSearchConfig,
    [TRANSACTION]: signerBaseSearchConfig,
}

const blockBaseSearchConfig = {
    getterName: BLOCKS_GETTER_NAME,
    entityKey: 'blockId',
    searchedEntityKey: 'id',
}

const blockSearchConfigFor = {
    [STATE_ELEMENT]: blockBaseSearchConfig,
    [TRANSACTION]: blockBaseSearchConfig,
}

const transactionsSearchConfigFor = {
    [BLOCK]: {
        getterName: TRANSACTIONS_GETTER_NAME,
        entityKey: 'id',
        searchedEntityKey: 'blockId',
        multiple: true
    },
}

const txnFamilySearchConfigFor = {
    [STATE_ELEMENT]: {
        getterName: TXN_FAMILIES_GETTER_NAME,
        entityKey: 'addressPrefix',
        searchedEntityKey: 'addressPrefix',
    }
}

const stateElementsSearchConfigFor = {
    [BLOCK]: {
        getterName: STATE_ELEMENTS_GETTER_NAME,
        entityKey: 'id',
        searchedEntityKey: 'blockId',
        multiple: true
    },
}

const signerTileSlotConfig = {
    label: 'Signer',
    tagName: 'entity-tile',
    detailsType: SIGNER,
    propNameToSearchConfig: {
        entity: signerSearchConfigFor
    },
}

const blockTileSlotConfig = {
    label: 'Block',
    tagName: 'entity-tile',
    detailsType: BLOCK,
    propNameToSearchConfig: {
        entity: blockSearchConfigFor
    },
}

const transactionsListSlotConfig = {
    label: 'Transactions',
    tagName: 'entities-list',
    detailsType: TRANSACTION,
    propNameToSearchConfig: {
        entities: transactionsSearchConfigFor
    },
}

const txnFamilyTileSlotConfig = {
    label: 'Transaction Family',
    tagName: 'entity-tile',
    detailsType: TXN_FAMILY,
    propNameToSearchConfig: {
        entity: txnFamilySearchConfigFor
    },
}

const stateElementsListSlotConfig = {
    label: 'Produced State Elements',
    tagName: 'entities-list',
    detailsType: STATE_ELEMENT,
    propNameToSearchConfig: {
        entities: stateElementsSearchConfigFor
    },
}

export const signerFieldNameToContent = {
    publicKey: 'Public key',
    label: 'Label',
}

export const txnFamilyFieldNameToContent = {
    addressPrefix: 'Address prefix',
    label: 'Label',
}

export const blockFieldNameToContent = {
    id: 'Id',
    num: 'Number',
    previousBlockId: 'Previous block id',
    stateHash: 'State hash',
    signerPublicKey: signerTileSlotConfig,
    transactions: transactionsListSlotConfig,
    stateElements: stateElementsListSlotConfig,
}

export const transactionFieldNameToContent = {
    id: 'Id',
    batchId: 'Batch id',
    payload: 'Payload',
    blockId: blockTileSlotConfig,
    signerPublicKey: signerTileSlotConfig,
}

export const stateElementFieldNameToContent = {
    address: 'Address',
    data: 'Data',
    createdAt: 'Created At',
    block: blockTileSlotConfig,
    txnFamily: txnFamilyTileSlotConfig,
}

export const entityNameToFieldsConfig = {
    [SIGNER]: signerFieldNameToContent,
    [TXN_FAMILY]: txnFamilyFieldNameToContent,
    // the rest is never used, so not added
    // btw, it's assumed (e.g. in DialogsManager.vue in showEdit method)
    // that these dicts' values are strings (e.g. 'Public key', 'Block id'...)
}


export const detailsConfig = {
    [BLOCK]: {
        title: 'Block',
        fieldNameToContent: blockFieldNameToContent,
        slots: [signerTileSlotConfig, transactionsListSlotConfig, stateElementsListSlotConfig]
    },
    [TRANSACTION]: {
        title: 'Transaction',
        fieldNameToContent: transactionFieldNameToContent,
        slots: [signerTileSlotConfig, blockTileSlotConfig],
    },
    [STATE_ELEMENT]: {
        title: 'State Element',
        fieldNameToContent: stateElementFieldNameToContent,
        slots: [blockTileSlotConfig, txnFamilyTileSlotConfig],
    },
    [SIGNER]: {
        title: 'Signer',
        fieldNameToContent: signerFieldNameToContent
    },
    [TXN_FAMILY]: {
        title: 'Transaction Family',
        fieldNameToContent: txnFamilyFieldNameToContent
    }
}

export const editingConfig = {
    [SIGNER]: {
        title: 'Signer',
        editableFields: [{
            name: 'label',
            rules: [rules.required, rules.minLength(4)]
        }]
    },
    [TXN_FAMILY]: {
        title: 'Transaction Family',
        editableFields: [{
            name: 'label',
            rules: [rules.required, rules.minLength(4)]
        }]
    },
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
