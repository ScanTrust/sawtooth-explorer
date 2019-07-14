<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs12 sm4 md2 xl1 v-for="stateElement in stateElements"
                        :key="stateElement.address + stateElement.blockId">
                    <entity-tile
                        :entity="stateElement"
                        :type="STATE_ELEMENT"
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
        STATE_ELEMENT,
        STATE_ELEMENTS,
        LOAD,
        SHOW_DETAILS,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'StateElements',
        data: () => ({ STATE_ELEMENT }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(STATE_ELEMENTS + LOAD)
            },
            showDetails (stateElement) {
                EventBus.$emit(SHOW_DETAILS, {
                    type: STATE_ELEMENT,
                    data: stateElement
                })
            },
        },
        computed: {
            ...mapGetters(STATE_ELEMENTS, ['stateElements']),
        },
        components: {
            EntityTile,
        }
    }
</script>
