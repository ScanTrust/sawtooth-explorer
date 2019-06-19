<template>
    <div class="pos-relative height-90-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
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
    import { mapGetters } from 'vuex'

    import TxnFamilyTile from '@/components/TxnFamilyTile'
    import TxnFamilyAdd from '@/components/dialogs/TxnFamilyAdd'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import { TXN_FAMILIES, LOAD, ADD, TXN_FAMILY, SHOW_DETAILS } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'TxnFamilies',
        data: () => ({ }),
        created () {
            this.load()
        },
        computed: {
            ...mapGetters(TXN_FAMILIES, ['txnFamilies'])
        },
        methods: {
            load () {
                this.$store.dispatch(TXN_FAMILIES + LOAD)
            },
            showDetails (txnFamily) {
                EventBus.$emit(SHOW_DETAILS, {
                    type: TXN_FAMILY,
                    data: txnFamily
                })
            },
            showAdd () {
                EventBus.$emit(SHOW_TXN_FAMILY_ADD)
            }
        },
        components: {
            TxnFamilyTile,
            TxnFamilyAdd,
            DetailsDialog
        }
    }
</script>
