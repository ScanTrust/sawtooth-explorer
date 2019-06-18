<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="txnFamily in txnFamilies" :key="txnFamily.addressPrefix">
                    <txn-family-tile
                        :txnFamily="txnFamily"
                        @showDetails="showDetails">
                    </txn-family-tile>
                </v-flex>
            </v-layout>
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
    import TxnFamilyAdd from '@/components/dialogs/TxnFamilyAdd'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import { TXN_FAMILIES, LOAD, ADD, TXN_FAMILY } from '@/store/constants'

    export default {
        name: 'TxnFamilies',
        data: () => ({
            txnFamilies: [],
            details: {
                title: 'Signer',
                fields: []
            },
            areDetailsShown: false,
            txnFamilyFieldNameToContent: {
                addressPrefix: 'Address prefix',
                label: 'Label',
            },
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
                EventBus.$emit(SHOW_DETAILS, {
                    type: TXN_FAMILY,
                    data: txnFamily
                })
            },
            closeDetails () {
                this.areDetailsShown = false
                this.details.fields = []
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
            TxnFamilyAdd,
            DetailsDialog
        }
    }
</script>
