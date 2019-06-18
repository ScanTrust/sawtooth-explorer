import {
    TRANSACTION,
    BLOCK,
    SIGNER,
    TXN_FAMILY,
    SIGNERS_GETTER_NAME,
    TXN_FAMILIES_GETTER_NAME,
    BLOCKS_GETTER_NAME,
    TRANSACTIONS_GETTER_NAME,
} from '@/store/constants'

const signerTileSlotConfig = {
    label: 'Signer',
    tagName: 'signer-tile',
    propNames: ['signer'],
    detailsType: SIGNER,
}

const blockTileSlotConfig = {
    label: 'Block',
    tagName: 'block-tile',
    propNames: ['block'],
    detailsType: BLOCK,
}

const transactionsListSlotConfig = {
    label: 'Transactions',
    tagName: 'transactions-list',
    propNames: ['transactions'],
    detailsType: TRANSACTION,
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
}

export const transactionFieldNameToContent = {
    id: 'Id',
    batchId: 'Batch id',
    payload: 'Payload',
    blockId: blockTileSlotConfig,
    signerPublicKey: signerTileSlotConfig,
}

export const detailsConfig = {
    [BLOCK]: {
        title: 'Block',
        fieldNameToContent: blockFieldNameToContent,
        slots: [signerTileSlotConfig, transactionsListSlotConfig],
        slotPropNameToSearchConfig: { // config used in search of each of the required props
            signer: {
                getterName: SIGNERS_GETTER_NAME,
                entityKey: 'signerPublicKey',
                searchedEntityKey: 'publicKey',
            },
            transactions: {
                getterName: TRANSACTIONS_GETTER_NAME,
                entityKey: 'id',
                searchedEntityKey: 'blockId',
                multiple: true
            }
        }
    },
    [TRANSACTION]: {
        title: 'Transaction',
        fieldNameToContent: transactionFieldNameToContent,
        slots: [signerTileSlotConfig, blockTileSlotConfig],
        slotPropNameToSearchConfig: {
            signer: {
                getterName: SIGNERS_GETTER_NAME,
                entityKey: 'signerPublicKey',
                searchedEntityKey: 'publicKey',
            },
            block: {
                getterName: BLOCKS_GETTER_NAME,
                entityKey: 'blockId',
                searchedEntityKey: 'id',
            }
        }
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
