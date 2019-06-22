<template>
    <v-list>
        <entity-tile
            v-for="entity in entities"
            :key="entity._id"
            :entity="entity"
            :type="type"
            @showDetails="showDetails">
        </entity-tile>
    </v-list>
</template>

<script>
    import EntityTile from './EntityTile'

    export default {
        name: 'entities-list',
        data: () => ({ }),
        props: {
            entities: {
                type: Array,
                default: () => ([ ])
            },
            type: {
                type: String,
                required: true
            }
        },
        methods: {
            showDetails (eventData) {
                this.$emit('showDetails', eventData)
            }
        },
        components: {
            EntityTile
        }
    }
</script>

<style scoped>

</style>
