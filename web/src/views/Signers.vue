<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="signer in signers" :key="signer.publicKey">
                    <entity-tile
                        :entity="signer"
                        :type="SIGNER"
                        @showDetails="showDetails">
                    </entity-tile>
                </v-flex>
            </v-layout>
        </v-container>
        <v-btn absolute
                dark fab
                bottom right
                color="indigo accent-2"
                @click="showAdd">
            <v-icon>add</v-icon>
        </v-btn>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile'
    import {
        SIGNER,
        SIGNERS,
        LOAD, ADD,
        SHOW_DETAILS,
        SHOW_SIGNER_ADD,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Signers',
        data: () => ({ SIGNER }),
        created () {
            this.load()
        },
        computed: {
            ...mapGetters(SIGNERS, ['signers'])
        },
        methods: {
            load () {
                this.$store.dispatch(SIGNERS + LOAD)
            },
            showDetails (signer) {
                EventBus.$emit(SHOW_DETAILS, {
                    type: SIGNER,
                    data: signer
                })
            },
            showAdd () {
                EventBus.$emit(SHOW_SIGNER_ADD)
            }
        },
        components: {
            EntityTile,
        }
    }
</script>
