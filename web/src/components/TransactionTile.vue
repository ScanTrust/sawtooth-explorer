<template>
    <v-list-tile avatar class="tile">
        <v-list-tile-avatar @click="clicked">
            <img :src="makeAvatar(transaction.id)">
        </v-list-tile-avatar>
        <v-list-tile-content @click="clicked">
            <v-list-tile-title v-html="transaction.id"></v-list-tile-title>
        </v-list-tile-content>
    </v-list-tile>
</template>

<script>
    import makeAvatarBase64 from '@/lib/common'

    export default {
        name: 'transaction-tile',
        data: () => ({
            
        }),
        props: {
            transaction: {
                type: Object,
                default: () => ({ })
            }
        },
        computed: {
            
        },
        methods: {
            clicked () {
                this.$emit('showDetails', this.transaction)
            },
            makeAvatar: makeAvatarBase64
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
