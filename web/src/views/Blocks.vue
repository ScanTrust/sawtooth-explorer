<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs12 sm4 md2 xl1 v-for="(block, i) in blocks" :key="block.id">
                    <entity-tile
                        :entity="block"
                        :type="BLOCK"
                        @showDetails="showDetails(block, i)">
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
        DETAILS_NEXT,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Blocks',
        data: () => ({
            detailedBlockIndex: null,

            BLOCK
        }),
        created () {
            this.load()
        },
        mounted () {
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const block = this.blocks[this.detailedBlockIndex + shiftSize]
                if (block)
                    this.showDetails(block, this.detailedBlockIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        methods: {
            load () {
                this.$store.dispatch(BLOCKS + LOAD)
            },
            showDetails (block, i) {
                this.detailedBlockIndex = i
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
