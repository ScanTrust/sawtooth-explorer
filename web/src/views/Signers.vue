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
                :shown="areDetailsShown"
                :config="details"
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

    export default {
        name: 'Signers',
        data: () => ({
            signers: [],
            details: {
                title: 'Signer',
                fields: []
            },
            areDetailsShown: false,
            signerFieldToTitle: {
                publicKey: 'Public key',
                label: 'Label',
            },
            signerAdding: false,
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
                for (const field in this.signerFieldToTitle) {
                    this.details.fields.push({
                        label: this.signerFieldToTitle[field],
                        value: signer[field]
                    })
                }
                this.areDetailsShown = true
            },
            closeDetails () {
                this.areDetailsShown = false
                this.details.fields = []
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
