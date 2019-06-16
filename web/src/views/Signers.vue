<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout>
                <v-flex shrink xs12 sm6 md4 lg2 v-for="signer in signers" :key="signer.publicKey">
                    <signer-tile
                        :signer="signer"
                        @showDetails="showDetails(signer)">
                    </signer-tile>
                </v-flex>
            </v-layout>
            <details-dialog
                :title="'Signer'"
                :shown="areDetailsShown"
                :detailsData="detailedSigner"
                :fieldToTitle="signerFieldToTitle"
                @close="closeDetails">
            </details-dialog>
            <signer-add
                :shown="signerAdding"
                @close="signerAdding = false"
                @add="add">
            </signer-add>
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
    import SignerTile from '@/components/SignerTile'
    import SignerAdd from '@/components/dialogs/SignerAdd'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import { SIGNERS, LOAD, ADD } from '@/store/constants'
    import { signerFieldToTitle } from '@/lib/display-config'

    export default {
        name: 'Signers',
        data: () => ({
            signers: [],
            detailedSigner: {},
            areDetailsShown: false,
            signerAdding: false,
            signerFieldToTitle,
        }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(SIGNERS + LOAD)
                    .then((signers) => {
                        this.signers = signers
                    })
            },
            showDetails (signer) {
                this.detailedSigner = signer
                console.log(this.detailedSigner)
                this.areDetailsShown = true
            },
            closeDetails () {
                this.areDetailsShown = false
            },
            showAdd () {
                this.signerAdding = true
            },
            add (signer) {
                this.$store.dispatch(SIGNERS + ADD, signer)
                    .then(this.load)
            }
        },
        components: {
            SignerTile,
            SignerAdd,
            DetailsDialog
        }
    }
</script>
