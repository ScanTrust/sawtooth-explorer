<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs12 sm4 md2 xl1 v-for="block in blocks" :key="block.id">
                    <entity-tile
                        :entity="block"
                        :type="BLOCK"
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
        BLOCK,
        BLOCKS,
        LOAD,
        SHOW_DETAILS,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Blocks',
        data: () => ({ BLOCK }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(BLOCKS + LOAD)
            },
            showDetails (block) {
                EventBus.$emit(SHOW_DETAILS, {
                    type: BLOCK,
                    data: block
                })
            },
        },
        computed: {
            ...mapGetters(BLOCKS, ['blocks']),
        },
        components: {
            EntityTile,
        }
    }
</script>
