<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs2 v-for="block in blocks" :key="block.id">
                    <block-tile
                        :block="block"
                        @showDetails="showDetails(block)">
                    </block-tile>
                </v-flex>
            </v-layout>
            <details-dialog
                :title="'Block'"
                :shown="areBlockDetailsShown"
                :detailsData="detailedBlock"
                :fieldToTitle="blockFieldToTitle"
                @close="closeDetails">
                <signer-tile
                    v-if="areBlockDetailsShown"
                    slot="signer-tile"
                    :signer="detailedBlockSigner"
                    @showDetails="showSignerDetails">
                </signer-tile>
            </details-dialog>
            <details-dialog
                :title="'Signer'"
                :shown="areSignerDetailsShown"
                :detailsData="detailedBlockSigner"
                :fieldToTitle="signerFieldToTitle"
                @close="closeSignerDetails">
            </details-dialog>
        </v-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import BlockTile from '@/components/BlockTile'
    import SignerTile from '@/components/SignerTile'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import { BLOCKS, LOAD, SIGNERS } from '@/store/constants'
    import { blockFieldToTitle, signerFieldToTitle } from '@/lib/display-config'

    export default {
        name: 'Blocks',
        data: () => ({
            blocks: [],
            detailedBlock: {},
            detailedBlockSigner: {},
            areBlockDetailsShown: false,
            areSignerDetailsShown: false,
            blockFieldToTitle,
            signerFieldToTitle,
        }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(BLOCKS + LOAD)
                    .then((blocks) => {
                        this.blocks = blocks
                    })
            },
            showDetails (block) {
                this.detailedBlock = block
                this.detailedBlockSigner = this.signers.find(
                    signer => signer.publicKey === block.signerPublicKey)
                this.detailedBlockSigner = this.detailedBlockSigner || {
                    publicKey: block.signerPublicKey,
                    label:     'Unknown'
                }
                console.log(this.detailedBlockSigner)
                this.areBlockDetailsShown = true
            },
            showSignerDetails (signer) {
                this.areSignerDetailsShown = true
            },
            closeDetails () {
                this.areBlockDetailsShown = false
                this.detailedBlockSigner = {}
            },
            closeSignerDetails () {
                this.areSignerDetailsShown = false
            }
        },
        computed: {
            ...mapGetters(SIGNERS, ['signers'])
        },
        components: {
            BlockTile,
            SignerTile,
            DetailsDialog
        }
    }
</script>
