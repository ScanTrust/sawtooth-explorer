<template>
    <v-container>
        <v-layout justify-center wrap>
            <v-flex xs11>
                <v-datetime-picker
                    v-model="since"
                    label="Show created after"
                    :width="400">
                </v-datetime-picker>
            </v-flex>
            <v-flex xs11>
                <text-fields-list v-model="addresses" :label="'Address prefix'"></text-fields-list>
            </v-flex>
            <v-flex xs11>
                <text-fields-list v-model="blockIds" :label="'Block id'"></text-fields-list>
            </v-flex>
        </v-layout>
    </v-container>    
</template>

<script>
import { STATE_ELEMENTS_FILTERS_COMPONENT } from '@/store/constants'
import TextFieldsList from '@/components/TextFieldsList'

export default {
    name: STATE_ELEMENTS_FILTERS_COMPONENT,
    data: () => ({
        since: null,
        addresses: [],
        blockIds: []
    }),
    computed: {
        filters () {
            return {
                since: this.since ? this.since.getTime() / 1000 : null,
                addresses: this.addresses.join(',') || null,
                blockIds: this.blockIds.join(',') || null,
            }
        }
    },
    watch: {
        filters () {
            this.$emit('input', this.filters)
        }
    },
    components: {
        TextFieldsList
    }
}
</script>

<style>

</style>
