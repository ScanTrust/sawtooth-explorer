<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="signer in signers" :key="signer.publicKey">
                    <signer-tile
                        :signer="signer"
                        @showDetails="showDetails">
                    </signer-tile>
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

    import SignerTile from '@/components/SignerTile'
    import SignerAdd from '@/components/dialogs/SignerAdd'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import {
        SIGNERS,
        LOAD, ADD,
        SHOW_DETAILS,
        SHOW_SIGNER_ADD,
        SIGNER
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Signers',
        data: () => ({
        }),
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
            SignerTile,
            SignerAdd,
            DetailsDialog
        }
    }
</script>
