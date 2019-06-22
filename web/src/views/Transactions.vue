<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs2 v-for="transaction in transactions" :key="transaction.id">
                    <entity-tile
                        :entity="transaction"
                        :type="TRANSACTION"
                        @showDetails="showDetails">
                    </entity-tile>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'
    import {
        TRANSACTIONS,
        LOAD,
        SHOW_DETAILS,
        TRANSACTION
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Transactions',
        data: () => ({ TRANSACTION }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(TRANSACTIONS + LOAD)
            },
            showDetails (transaction) {
                EventBus.$emit(SHOW_DETAILS, {
                    type: TRANSACTION,
                    data: transaction,
                })
            }
        },
        computed: {
            ...mapGetters(TRANSACTIONS, ['transactions']),
        },
        components: {
            EntityTile,
        }
    }
</script>
