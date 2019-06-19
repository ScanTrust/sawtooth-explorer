<template>
    <div class="pos-relative height-90-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs2 v-for="transaction in transactions" :key="transaction.id">
                    <transaction-tile
                        :transaction="transaction"
                        @showDetails="showDetails">
                    </transaction-tile>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    import TransactionTile from '@/components/TransactionTile'
    import SignerTile from '@/components/SignerTile'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import {
        BLOCKS,
        TRANSACTIONS,
        LOAD,
        SIGNERS,
        SHOW_DETAILS,
        TRANSACTION
    } from '@/store/constants'
    import {
        blockFieldNameToContent,
        signerFieldNameToContent,
        transactionFieldNameToContent
    } from '@/lib/display-config'
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'Transactions',
        data: () => ({
            detailedTransaction: {},
            detailedTransactionSigner: {},
            detailedTransactionBlock: {},
            areSignerDetailsShown: false,
            signerFieldNameToContent,
            blockFieldNameToContent,
            transactionFieldNameToContent,
        }),
        created () {
            this.load()
        },
        methods: {
            load () {
                this.$store.dispatch(TRANSACTIONS + LOAD)
            },
            showDetails (transaction) {
                this.detailedTransaction = transaction
                this.detailedTransactionSigner = this.signers.find(
                    signer => signer.publicKey === transaction.signerPublicKey)
                if (!this.detailedTransactionSigner)
                    this.detailedTransactionSigner = { publicKey: transaction.signerPublicKey }
                this.detailedTransactionBlock = this.blocks.find(
                    block => block.id === transaction.blockId)
                if (!this.detailedTransactionBlock)
                    this.detailedTransactionBlock = { id: transaction.blockId }
                this.detailedBlockSigner = this.signers.find(
                    signer => signer.publicKey === this.detailedTransactionBlock.signerPublicKey)
                if (!this.detailedBlockSigner)
                    this.detailedBlockSigner = { publicKey: this.detailedTransactionBlock.signerPublicKey }
                EventBus.$emit(SHOW_DETAILS, {
                    type: TRANSACTION,
                    data: this.detailedTransaction,
                    props: {
                        block: this.detailedTransactionBlock,
                        signer: this.detailedTransactionSigner,
                        detailsProps: {
                            signer: this.detailedBlockSigner
                        }
                    }
                })
            }
        },
        computed: {
            ...mapGetters(SIGNERS, ['signers']),
            ...mapGetters(BLOCKS, ['blocks']),
            ...mapGetters(TRANSACTIONS, ['transactions']),
        },
        components: {
            TransactionTile,
            SignerTile,
            DetailsDialog
        }
    }
</script>
