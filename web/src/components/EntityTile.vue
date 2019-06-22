<template>
    <v-list-tile :avatar="entity[avatar] ? true : false" class="tile">
        <v-list-tile-avatar v-if="entity[avatar]" @click="clicked">
            <img :src="makeAvatar(entity[avatar])">
        </v-list-tile-avatar>
        <v-list-tile-content @click="clicked">
            <v-list-tile-title v-html="entity[title] || 'Unknown'"></v-list-tile-title>
            <v-list-tile-sub-title v-if="entity[subTitle]" v-html="entity[subTitle]"></v-list-tile-sub-title>
        </v-list-tile-content>
    </v-list-tile>
</template>

<script>
    import makeAvatarBase64 from '@/lib/common'
    import { tilesConfig } from '@/lib/display-config'

    export default {
        name: 'entity-tile',
        data: () => ({
            
        }),
        props: {
            entity: {
                type: Object,
                default: () => ({ })
            },
            type: {
                type: String,
                required: true
            }
        },
        computed: {
            avatar () { return tilesConfig[this.type].avatar },
            title () { return tilesConfig[this.type].title },
            subTitle () { return tilesConfig[this.type].subTitle },
        },
        methods: {
            clicked () {
                this.$emit('showDetails', this.entity)
            },
            makeAvatar: makeAvatarBase64
        },
        
    }
</script>

<style scoped>
  .tile {
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12) !important;
    cursor: pointer;
    padding: 5px 0px;
  }
</style>
