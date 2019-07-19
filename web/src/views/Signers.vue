<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="(signer, i) in signers" :key="signer.publicKey">
                    <entity-tile
                        :entity="signer"
                        :type="SIGNER"
                        @showDetails="showDetails(signer, i)">
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
        DETAILS_NEXT,
        SHOW_SIGNER_ADD,
    } from '@/store/constants'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Signers',
        data: () => ({
            detailedSignerIndex: null,
            
            SIGNER
        }),
        created () {
            this.load()
        },
        mounted () {
            EventBus.$on(DETAILS_NEXT, shiftSize => {
                const signer = this.signers[this.detailedSignerIndex + shiftSize]
                if (signer)
                    this.showDetails(signer, this.detailedSignerIndex + shiftSize)
            })
        },
        beforeDestroy () {
            EventBus.$off(DETAILS_NEXT)
        },
        computed: {
            ...mapGetters(SIGNERS, ['signers'])
        },
        methods: {
            load () {
                this.$store.dispatch(SIGNERS + LOAD)
            },
            showDetails (signer, i) {
                this.detailedSignerIndex = i
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
