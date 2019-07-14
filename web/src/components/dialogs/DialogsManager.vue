<template>
    <div>
        <!-- Some of the following dialogs are
            made visible by a SHOW_* event,
            their props are computed from
            display-config.js and event-passed data -->
        <details-dialog
            :title="details.title"
            :shown="detailsShown"
            :displayedFields="details.displayedFields"
            :detailsType="details.type"
            :detailedEntity="details.data"
            :changeable="datailedDataChangeable"
            @close="closeDetails">
                <template v-if="detailsShown">
                    <!-- Either entity-tile or entities-list or payload-section now,
                        depending on what is detailed right now
                        (i.e. what details.slots it has) -->
                    <component
                        v-for="slot in details.slots"
                        :key="slot.entityFieldLabel"
                        :is="slot.tagName"
                        :slot="slot.name"
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
            :type="editData.type"
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
    import DetailsDialog from './DetailsDialog'
    import EditDialog from './EditDialog'
    import FiltersDialog from './FiltersDialog'
    import SignerAdd from './SignerAdd'
    import TxnFamilyAdd from './TxnFamilyAdd'
    import EntityTile from '@/components/EntityTile'
    import EntitiesList from '@/components/EntitiesList'
    import PayloadSection from '@/components/PayloadSection'

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
        FETCH_PROP_VALUE,
    } from '@/store/constants'
    import {
        entityNameToConfig,
        typeToStoreNamespace,
    } from '@/lib/display-config'
    import { isEmptyValue } from '@/lib/common'

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
                displayedFields: [],
                data: {},
                slots: [],
                type: ''
            },
            datailedDataChangeable: false,

            editData: {
                title: 'Unknown',
                type: '',
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
                // filling title, type, data
                this.details.title = entityNameToConfig[type].title
                this.details.type = type
                this.details.data = data
                // helper flag
                this.datailedDataChangeable = !!entityNameToConfig[type].editableFields
                // refilling this.details.displayedFields and ..slots
                this.details.displayedFields.splice(0, this.details.displayedFields.length)
                this.details.slots.splice(0, this.details.slots.length)
                // creating 2 references:
                const displayedFields = this.details.displayedFields
                const slots = this.details.slots
                entityNameToConfig[type].detailsFields.forEach(async (field, i) => {
                    const displayedField = { label: field.label }
                    let fieldShouldBeIncluded = true
                    if (field.entityFieldName) {
                        displayedField.value = data[field.entityFieldName]
                    } else if (field.slotConfig) {
                        const slotConfig = field.slotConfig
                        const slot = {
                            name: `${slotConfig.tagName}-${i}`,
                            tagName: slotConfig.tagName,
                            detailsType: slotConfig.detailsType,
                            props: {},
                        }
                        displayedField.slotName = slot.name
                        displayedField.tagName = slot.tagName
                        displayedField.detailsType = slot.detailsType
                        // filling slot's props
                        let slotHasData = false
                        if (slotConfig.propNameToEntityField) {
                            for (const propName in slotConfig.propNameToEntityField) {
                                const entityFieldName = slotConfig.propNameToEntityField[propName]
                                slot.props[propName] = data[entityFieldName]
                                slotHasData = slotHasData || !isEmptyValue(slot.props[propName])
                            }
                        } else if (slotConfig.propNameToStoreSearchConfig) {
                            for (const propName in slotConfig.propNameToStoreSearchConfig) {
                                const searchConfig = slotConfig.propNameToStoreSearchConfig[propName]
                                slot.props[propName] = await this.$store.dispatch(
                                    FETCH_PROP_VALUE,
                                    {
                                        searchedEntityStoreNameSpace: typeToStoreNamespace[slotConfig.detailsType],
                                        searchConfig, data
                                    }
                                )
                                slotHasData = slotHasData || !isEmptyValue(slot.props[propName])
                            }
                        }
                        if (slotHasData)
                            slots.push(slot)
                        fieldShouldBeIncluded = slotHasData
                    }
                    if (fieldShouldBeIncluded)
                        displayedFields.push(displayedField)
                })
                // showing
                this.detailsShown = true
            },
            showEdit ({
                type,
                data
            }) {
                const config = entityNameToConfig[type]
                // filling title, type, editedEntity
                this.editData.title = `Edit ${config.title}`
                this.editData.type = type
                this.editData.editedEntity = data
                // refilling editableFields and uneditableFields
                this.editData.editableFields.splice(0, this.editData.editableFields.length)
                this.editData.uneditableFields.splice(0, this.editData.uneditableFields.length)
                config.detailsFields.forEach(field => {
                    if (field.entityFieldName) {
                        const editableField = config.editableFields.find(
                            editableField => editableField.entityFieldName == field.entityFieldName)
                        // it's by ref. to fill either one or the other
                        const accordingFieldsArray = this.editData[
                            editableField ? 'editableFields' : 'uneditableFields'
                        ]
                        accordingFieldsArray.push({
                            label: field.label,
                            name: field.entityFieldName,
                            rules: editableField ? editableField.rules : null
                        })
                    }
                })
                this.editShown = true
            },
            showAdd ({data}) {
                const entityName = this.typeToEntityName[this.details.type]
                this.addData[entityName] = data
                this[`${entityName}AddShown`] = true
            },
            closeDetails () {
                this.detailsShown = false
            },
            closeEdit () {
                this.editShown = false
            },
            editEntity ({type, entity}) {
                this.$store
                    .dispatch(typeToStoreNamespace[type] + EDIT, entity)
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
            PayloadSection,
        }
    }
</script>
