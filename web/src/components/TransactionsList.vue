<template>
    <v-list>
        <transaction-tile
            v-for="transaction in transactions"
            :key="transaction.id"
            :transaction="transaction"
            @showDetails="showDetails">
        </transaction-tile>
    </v-list>
</template>

<script>
    import TransactionTile from './TransactionTile'

    export default {
        name: 'transactions-list',
        data: () => ({
            
        }),
        props: {
            transactions: {
                type: Array,
                default: () => ([ ])
            }
        },
        methods: {
            showDetails (eventData) {
                this.$emit('showDetails', eventData)
            }
        },
        components: {
            TransactionTile
        }
    }
</script>

<style scoped>

</style>
