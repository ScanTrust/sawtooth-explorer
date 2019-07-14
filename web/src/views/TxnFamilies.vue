<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="txnFamily in txnFamilies" :key="txnFamily.addressPrefix">
                    <entity-tile
                        :entity="txnFamily"
                        :type="TXN_FAMILY"
                        @showDetails="showDetails">
                    </entity-tile>
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

    import EntityTile from '@/components/EntityTile'
    import {
        TXN_FAMILIES,
        LOAD, ADD,
        TXN_FAMILY,
        SHOW_DETAILS,
        SHOW_TXN_FAMILY_ADD,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'TxnFamilies',
        data: () => ({ TXN_FAMILY }),
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
            EntityTile,
        }
    }
</script>
