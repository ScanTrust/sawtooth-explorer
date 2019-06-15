<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="txnFamily in txnFamilies" :key="txnFamily.addressPrefix">
                    <txn-family-tile
                        :txnFamily="txnFamily"
                        @showDetails="showDetails(txnFamily)">
                    </txn-family-tile>
                </v-flex>
            </v-layout>
            <txn-family-details
                :shown="txnFamilyDetails"
                :addressPrefix="detailedTxnFamily.addressPrefix"
                :label="detailedTxnFamily.label"
                @close="txnFamilyDetails = false">
            </txn-family-details>
            <txn-family-add
                :shown="txnFamilyAdding"
                @close="txnFamilyAdding = false"
                @add="add">
            </txn-family-add>
        </v-container>
        <v-btn absolute
                dark fab
                bottom right
                color="indigo accent-2"
                @click="showAdd">
            <v-icon>add</v-icon>
        </v-btn>
    </div>
</template>

<script>
    import TxnFamilyTile from '@/components/TxnFamilyTile'
    import TxnFamilyDetails from '@/components/dialogs/TxnFamilyDetails'
    import TxnFamilyAdd from '@/components/dialogs/TxnFamilyAdd'
    import { TXN_FAMILIES, LOAD, ADD } from '@/store/constants'

    export default {
        name: 'TxnFamilies',
        data: () => ({
            txnFamilies: [],
            txnFamilyDetails: false,
            detailedTxnFamily: {},
            txnFamilyAdding: false,
        }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(TXN_FAMILIES + LOAD)
                    .then((txnFamilies) => {
                        this.txnFamilies = txnFamilies
                    })
            },
            showDetails (txnFamily) {
                this.detailedTxnFamily = txnFamily
                this.txnFamilyDetails = true
            },
            showAdd () {
                this.txnFamilyAdding = true
            },
            add (txnFamily) {
                this.$store.dispatch(TXN_FAMILIES + ADD, txnFamily)
                    .then(this.load)
            }
        },
        components: {
            TxnFamilyTile,
            TxnFamilyDetails,
            TxnFamilyAdd
        }
    }
</script>
