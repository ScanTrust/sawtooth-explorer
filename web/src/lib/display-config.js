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

const signerBaseSearchConfig = { // config used in search of the required prop that is passed to slot
    entityKey: 'signerPublicKey',
    searchedEntityKey: 'publicKey',
}

const blockBaseSearchConfig = {
    entityKey: 'blockId',
    searchedEntityKey: 'id',
}
/**
 * Values of dict below this comment block are entities configs.
 * 1. If an entity is ever displayed in a details dialog,
 * its config has 'title' and 'fieldNameToLabel'. (e.g. BLOCK)
 * 2. If one wants to pass whatever slot to this details dialog
 * to display it infront of one of the labels from 'fieldNameToLabel' (see field's explanation below),
 * he specifies it as an entity (name) in the value of 'fieldNameToEntityName',
 * and also adds this entity's name's config (according to 3) in the outer dict
 * (just like I did with TRANSACTIONS or STATE_ELEMENTS).
 * 3. If an entity is ever passed to a slot (continuing 2),
 * its config has 'tileSlotConfig' field. (e.g. BLOCK)
 * 4. If an entity can be edited, there's 'editableFields' in its config (e.g. SIGNER)  
 * 
 * 1. 'title' is simply the title of the details dialog;
 * 'fieldNameToLabel' is a map of entities' objects' fields' names
 * to labels that are written each below one another in the dialog.
 * 
 * 2. 'fieldNameToEntityName' well explained above
 * 
 * 3. 'tileSlotConfig' allows to specify a 'tag-name' (tag of the component passed as slot),
 * 'getterName' as a getter in vuex store, 'detailsType' is the type of is passed to this slot as :type, :slot, :key;
 * :type is to provide slot-component with knowledge of where it is used,
 * :slot is to let details dialog know where he should insert it,
 * :key is just a vue v-for thing.
 * Also, DetailsManager.vue listens for showDetails on the slot
 * handling it with showDetails method,
 * passing {type: detailsType, data: $event},
 * where $event is an actual event payload
 * 
 * 4. 'editableFields' is a field used when
 * 1) some component emitted SHOW_EDIT on a global EventBus
 * passing { type: *edited_type*, data: *edited_data* },
 * say, {type: 'SIGNER', data: {publicKey: ..., label: ..., ...}};
 * the config on which editableFields is taken corresponds to 'type'
 * 2) SHOW_DETAILS takes place and DetailsDialog.vue decides
 * if EDIT button should be shown in it
 */
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
