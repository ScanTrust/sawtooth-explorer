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
            :fieldNameToContent="details.fieldNameToContent"
            @close="closeDetails">
                <template v-if="detailsShown">
                    <!-- One of *-tile components,
                        depending on what is detailed right now
                        (i.e. what details.slots it has) -->
                    <component 
                        v-for="slot in details.slots"
                        :key="slot.tagName"
                        :is="slot.tagName"
                        :slot="slot.tagName"
                        v-bind="slot.props"
                        @showDetails="showDetails({
                            type: slot.detailsType,
                            data: $event,
                        })">
                    </component>
                </template>
        </details-dialog>
        <signer-add
            :shown="signerAddShown"
            @close="signerAddShown = false"
            @add="addSigner">
        </signer-add>
        <txn-family-add
            :shown="txnFamilyAddShown"
            @close="txnFamilyAddShown = false"
            @add="addTxnFamily">
        </txn-family-add>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import DetailsDialog from './DetailsDialog'
    import SignerAdd from './SignerAdd'
    import TxnFamilyAdd from './TxnFamilyAdd'
    import BlockTile from '@/components/BlockTile'
    import SignerTile from '@/components/SignerTile'
    import TransactionTile from '@/components/TransactionTile'
    import TransactionsList from '@/components/TransactionsList'
    import TxnFamilyTile from '@/components/TxnFamilyTile'
    import { EventBus } from '@/lib/event-bus'
    import {
        SHOW_DETAILS,
        SHOW_SIGNER_ADD,
        SHOW_TXN_FAMILY_ADD,
        SIGNERS,
        BLOCKS,
        TRANSACTIONS,
        TXN_FAMILIES,
        ADD,
    } from '@/store/constants'
    import { detailsConfig } from '@/lib/display-config'

    export default {
        name: 'dialogs',
        data: () => ({
            detailsShown: false,
            signerAddShown: false,
            txnFamilyAddShown: false,

            details: {
                title: 'Unknown',
                fieldNameToContent: {},
                data: {},
                props: {},
                slots: [ ]
            },
        }),
        created () {
            EventBus.$on(SHOW_DETAILS, this.showDetails)
            EventBus.$on(SHOW_SIGNER_ADD, () => {
                this.signerAddShown = true
            })
            EventBus.$on(SHOW_TXN_FAMILY_ADD, () => {
                this.txnFamilyAddShown = true
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
                this.detailsShown = false
                this.details.title = detailsConfig[type].title
                this.details.data = data
                this.details.fieldNameToContent = detailsConfig[type].fieldNameToContent
                if (detailsConfig[type].slots && detailsConfig[type].slots.length > 0) {
                    this.details.slots.splice(0, this.details.slots.length)
                    detailsConfig[type].slots.forEach(slotConfig => {
                        const slot = Object.assign({}, slotConfig)
                        slot.props = {}
                        slot.propNames.forEach(propName => {
                            // Need to fetch prop-value for this propName
                            // from store using display-config.js and
                            // passed data argument.
                            const searchConfig = detailsConfig[type].slotPropNameToSearchConfig[propName]
                            const entities = this[searchConfig.getterName]
                            slot.props[propName] = entities[searchConfig.multiple ? 'filter' : 'find'](entity => {
                                return entity[searchConfig.searchedEntityKey] == data[searchConfig.entityKey]
                            }) || { [searchConfig.searchedEntityKey]: data[searchConfig.entityKey] }
                            // Example of possible call above when
                            // some values are substituted is
                            // slot.props['signer'] = this.signers.find(
                            //     signer => signer.puplicKey == data.signerPublicKey)
                            // (data variable can contain a block or a transaction here)
                        })
                        this.details.slots.push(slot)
                    })
                }
                this.detailsShown = true
            },
            closeDetails () {
                this.detailsShown = false
            },
            addSigner (signer) {
                this.$store.dispatch(SIGNERS + ADD, signer)
            },
            addTxnFamily (txnFamily) {
                this.$store.dispatch(TXN_FAMILIES + ADD, txnFamily)                
            }
        },
        computed: {
            ...mapGetters(SIGNERS, ['signers']),
            ...mapGetters(BLOCKS, ['blocks']),
            ...mapGetters(TRANSACTIONS, ['transactions']),  
            ...mapGetters(TXN_FAMILIES, ['txnFamilies']),  
        },
        components: {
            DetailsDialog,
            SignerAdd,
            TxnFamilyAdd,
            BlockTile,
            SignerTile,
            TransactionTile,
            TransactionsList,
            TxnFamilyTile,
        }
    }
</script>
