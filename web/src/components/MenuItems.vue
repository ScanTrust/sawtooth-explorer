<template>
    <v-list dense>
        <template v-for="(item, i) in items">
            <v-flex v-if="item.heading" :key="i" xs6>
                <v-subheader v-if="item.heading">
                    {{ item.heading }}
                </v-subheader>
            </v-flex>
            <v-divider
                v-else-if="item.divider" class="my-3" :key="i" />
            <v-list-tile v-else-if="item.to" :key="i" :to="item.to">
                <v-list-tile-action>
                    <v-icon>{{ item.iconName }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.label }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
                :disabled="filtersUnallowed" v-else-if="item.event" :key="i"
                @click="emitEvent(item.event, item.eventPayload)">
                <v-list-tile-action>
                    <v-icon>{{ item.iconName }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.label }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
    </v-list>
</template>

<script>
import { EventBus } from '@/lib/event-bus'
import {
    BLOCKS_PATH,
    SIGNERS_PATH,
    TXN_FAMILIES_PATH,
    TRANSACTIONS_PATH,
    STATE_PATH, 
} from '@/router/constants'

export default {
    name: 'menu-items',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    methods: {
        emitEvent (event, eventPayload) {
            EventBus.$emit(event, eventPayload)
        }
    },
    computed: {
        filtersUnallowed () {
            return ![
                STATE_PATH,
                BLOCKS_PATH,
                TRANSACTIONS_PATH,
                SIGNERS_PATH,
                TXN_FAMILIES_PATH
            ].includes(this.$route.path)
        },
    }
}
</script>

<style>

</style>
