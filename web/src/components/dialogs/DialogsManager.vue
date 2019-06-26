<template>
    <div>
        <!-- Some of the following dialogs are
            made visible by a SHOW_* event,
            their props are computed from
            display-config.js and event-passed data -->
        <details-dialog
            :title="details.title"
            :shown="detailsShown"
            :detailsData="details.data"
            :fieldNameToLabel="details.fieldNameToLabel"
            :fieldNameToEntityName="details.fieldNameToEntityName"
            :dataPresent="detailedDataPresent"
            :changeable="datailedDataChangeable"
            @close="closeDetails">
                <template v-if="detailsShown">
                    <!-- Either entity-tile or entities-list now,
                        depending on what is detailed right now
                        (i.e. what details.slots it has) -->
                    <component
                        v-for="slot in details.slots"
                        :key="slot.detailsType"
                        :is="slot.tagName"
                        :slot="slot.detailsType"
                        :type="slot.detailsType"
                        v-bind="slot.props"
                        @showDetails="showDetails({
                            type: slot.detailsType,
                            data: $event,
                        })">
                    </component>
                </template>
        </details-dialog>
        <edit-dialog
            :title="editData.title"
            :shown="editShown"
            :data="editData.editedEntity"
            :uneditableFields="editData.uneditableFields"
            :editableFields="editData.editableFields"
            @close="closeEdit"
            @edit="editEntity">
        </edit-dialog>
        <signer-add
            :shown="signerAddShown"
            :data="addData.signer"
            @close="signerAddShown = false"
            @add="addSigner">
        </signer-add>
        <txn-family-add
            :shown="txnFamilyAddShown"
            :data="addData.txnFamily"
            @close="txnFamilyAddShown = false"
            @add="addTxnFamily">
        </txn-family-add>
        <filters-dialog
            :shown="filtersShown"
            @close="filtersShown = false">
        </filters-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import DetailsDialog from './DetailsDialog'
    import EditDialog from './EditDialog'
    import FiltersDialog from './FiltersDialog'
    import SignerAdd from './SignerAdd'
    import TxnFamilyAdd from './TxnFamilyAdd'
    import EntityTile from '@/components/EntityTile'
    import EntitiesList from '@/components/EntitiesList'

    import { EventBus } from '@/lib/event-bus'
    import {
        SHOW_DETAILS,
        SHOW_EDIT,
        SHOW_ADD,
        SHOW_SIGNER_ADD,
        SHOW_TXN_FAMILY_ADD,
        SHOW_FILTERS,
        SIGNERS,
        TXN_FAMILIES,
        BLOCKS,
        TRANSACTIONS,
        STATE_ELEMENTS,
        SIGNER,
        TXN_FAMILY,
        ADD,
        EDIT,
        SIGNERS_GETTER_NAME,
        TXN_FAMILIES_GETTER_NAME,
        BLOCKS_GETTER_NAME,
        TRANSACTIONS_GETTER_NAME,
        STATE_ELEMENTS_GETTER_NAME,
    } from '@/store/constants'
    import {
        entityNameToConfig,
        typeToStoreNamespace,
    } from '@/lib/display-config'

    export default {
        name: 'dialogs',
        data: () => ({
            detailsShown: false,
            editShown: false,
            signerAddShown: false,
            txnFamilyAddShown: false,
            filtersShown: false,

            details: {
                title: 'Unknown',
                fieldNameToEntityName: {},
                data: {},
                props: {},
                slots: []
            },
            detailedDataPresent: false,
            datailedDataChangeable: false,
            lastDetailedType: null,

            editData: {
                title: 'Unknown',
                editedEntity: {},
                uneditableFields: [],
                editableFields: [],
            },

            addData: {
                signer: { },
                txnFamily: { }
            },

            typeToEntityName: {
                [SIGNER]: 'signer',
                [TXN_FAMILY]: 'txnFamily',
            }
        }),
        mounted () {
            EventBus.$on(SHOW_DETAILS, this.showDetails)
            EventBus.$on(SHOW_EDIT, this.showEdit)
            EventBus.$on(SHOW_ADD, this.showAdd)
            EventBus.$on(SHOW_SIGNER_ADD, () => {
                this.signerAddShown = true
            })
            EventBus.$on(SHOW_TXN_FAMILY_ADD, () => {
                this.txnFamilyAddShown = true
            })
            EventBus.$on(SHOW_FILTERS, () => {
                this.filtersShown = true
            })
        },
        methods: {
            /*
             * Options:
             *   type  -- string like "TRANSACTION", "BLOCK", "SIGNER", "TXN_FAMILY",
             *            initially passed as constant imported from @/store/constants
             *   data  -- for type == "SIGNER" just a signer object
             */
            showDetails ({
                type,
                data
            }) {
                this.lastDetailedType = type
                this.details.title = entityNameToConfig[type].title
                this.datailedDataChangeable = !!entityNameToConfig[type].editableFields
                this.detailedDataPresent = Object.keys(data).length > 1
                this.details.data = data
                this.details.fieldNameToLabel = entityNameToConfig[type].fieldNameToLabel
                this.details.fieldNameToEntityName = entityNameToConfig[type].fieldNameToEntityName
                this.details.slots.splice(0, this.details.slots.length)
                for (let slotFieldName in entityNameToConfig[type].fieldNameToEntityName) {
                    const slotEntityName = entityNameToConfig[type].fieldNameToEntityName[slotFieldName]
                    const slot = entityNameToConfig[slotEntityName].tileSlotConfig
                    slot.props = {}
                    slot.type = type
                    for (let propName in slot.propNameToSearchConfig) {
                        slot.props[propName] = this.fetchPropValue(propName, slot, data)
                    }
                    this.details.slots.push(slot)
                }
                this.detailsShown = true
            },
            fetchPropValue (propName, slot, data) {
                // Need to fetch prop-value for this propName
                // from store using slot config and
                // passed data argument.
                const entities = this[slot.getterName]
                let searchConfig = slot.propNameToSearchConfig[propName][slot.type]
                return entities[searchConfig.multiple ? 'filter' : 'find'](entity => {
                    return entity[searchConfig.searchedEntityKey] == data[searchConfig.entityKey]
                }) || { [searchConfig.searchedEntityKey]: data[searchConfig.entityKey] }
                // Example of possible call above when
                // some values are substituted is
                // slot.props['signer'] = this.signers.find(
                //     signer => signer.puplicKey == data.signerPublicKey)
                // (data variable can contain a block or a transaction here)
            },
            showEdit ({data}) {
                const config = entityNameToConfig[this.lastDetailedType]
                this.editData.title = `Edit ${config.title}`
                this.editData.editedEntity = data
                this.editData.editableFields.splice(0, this.editData.editableFields.length)
                this.editData.uneditableFields.splice(0, this.editData.uneditableFields.length)
                for (let fieldName in entityNameToConfig[this.lastDetailedType].fieldNameToLabel) { // populating this.editData.editableFields and ..uneditableFields
                    const editableField = config.editableFields.find(field => field.name == fieldName)
                    const accordingFieldsArray = this.editData[ // it's by ref. to fill either one or the other
                        editableField ? 'editableFields' : 'uneditableFields'
                    ]
                    const label = entityNameToConfig[this.lastDetailedType].fieldNameToLabel[fieldName]
                    accordingFieldsArray.push({
                        label: label,
                        name: fieldName,
                        rules: editableField ? editableField.rules : null
                    })
                }
                this.editShown = true
            },
            showAdd ({data}) {
                const entityName = this.typeToEntityName[this.lastDetailedType]
                this.addData[entityName] = data
                this[`${entityName}AddShown`] = true
            },
            closeDetails () {
                this.detailsShown = false
            },
            closeEdit () {
                this.editShown = false
            },
            editEntity (entity) {
                this.$store
                    .dispatch(typeToStoreNamespace[this.lastDetailedType] + EDIT, entity)
                    .then(this.closeDetails)
                    .catch(this.closeDetails)
            },
            addSigner (signer) {
                this.$store
                    .dispatch(SIGNERS + ADD, signer)
                    .then(this.closeDetails)
                    .catch(this.closeDetails)
            },
            addTxnFamily (txnFamily) {
                this.$store
                    .dispatch(TXN_FAMILIES + ADD, txnFamily)
                    .then(this.closeDetails)
                    .catch(this.closeDetails)
            }
        },
        computed: {
            ...mapGetters(SIGNERS, [SIGNERS_GETTER_NAME]),
            ...mapGetters(BLOCKS, [BLOCKS_GETTER_NAME]),
            ...mapGetters(TRANSACTIONS, [TRANSACTIONS_GETTER_NAME]),
            ...mapGetters(TXN_FAMILIES, [TXN_FAMILIES_GETTER_NAME]),
            ...mapGetters(STATE_ELEMENTS, [STATE_ELEMENTS_GETTER_NAME]),
        },
        beforeDestroy () {
            [SHOW_DETAILS,
            SHOW_EDIT,
            SHOW_ADD,
            SHOW_SIGNER_ADD,
            SHOW_TXN_FAMILY_ADD,
            SHOW_FILTERS].forEach(event => {
                EventBus.$off(event)
            })
        },
        components: {
            DetailsDialog,
            EditDialog,
            FiltersDialog,
            SignerAdd,
            TxnFamilyAdd,
            EntityTile,
            EntitiesList,
        }
    }
</script>
