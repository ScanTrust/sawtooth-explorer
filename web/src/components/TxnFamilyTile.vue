<template>
    <v-list-tile class="tile">
        <v-list-tile-content @click="clicked">
            <v-list-tile-title v-html="txnFamily.addressPrefix"></v-list-tile-title>
            <v-list-tile-sub-title v-html="txnFamily.label || 'Unknown'"></v-list-tile-sub-title>
        </v-list-tile-content>
    </v-list-tile>
</template>

<script>
    export default {
        name: 'txn-family-tile',
        data: () => ({
            
        }),
        props: {
            txnFamily: {
                type: Object,
                default: () => ({ })
            }
        },
        computed: {
            
        },
        methods: {
            clicked () {
                this.$emit('showDetails', this.txnFamily)
            }
        }
    }
</script>

<style scoped>
  .tile {
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12) !important;
    cursor: pointer;
    padding: 5px 0px;
  }
</style>
