<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs2 v-for="block in blocks" :key="block.id">
                    <block-tile
                        :block="block"
                        @showDetails="showDetails">
                    </block-tile>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import BlockTile from '@/components/BlockTile'
    import SignerTile from '@/components/SignerTile'
    import TransactionTile from '@/components/TransactionTile'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import {
        BLOCKS,
        TRANSACTIONS,
        LOAD,
        SIGNERS,
        SHOW_DETAILS,
        BLOCK
    } from '@/store/constants'
    import { blockFieldNameToContent, signerFieldNameToContent } from '@/lib/display-config'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Blocks',
        data: () => ({ }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(BLOCKS + LOAD)
            },
            showDetails (block) {
                let detailedBlockSigner = this.signers.find(
                    signer => signer.publicKey === block.signerPublicKey)
                detailedBlockSigner = detailedBlockSigner || { publicKey: block.signerPublicKey }
                let detailedBlockTransactions = this.transactions.filter(txn => txn.blockId == block.id)
                let detailedBlockTransactionsSigners = this.signers.filter(
                    signer => detailedBlockTransactions.find(txn => txn.signerPublicKey == signer.publicKey))
                EventBus.$emit(SHOW_DETAILS, {
                    type: BLOCK,
                    data: block,
                    props: {
                        signer: detailedBlockSigner,
                        transactions: detailedBlockTransactions,
                        detailsProps: {
                            signers: detailedBlockTransactionsSigners
                        }
                    }
                })

            },
        },
        computed: {
            ...mapGetters(BLOCKS, ['blocks']),
            ...mapGetters(SIGNERS, ['signers']),
            ...mapGetters(TRANSACTIONS, ['transactions']),
        },
        components: {
            BlockTile,
            SignerTile,
            TransactionTile,
            DetailsDialog
        }
    }
</script>
