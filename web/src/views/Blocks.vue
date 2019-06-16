<template>
    <div class="pos-relative height-90-prc">
        <v-container fill-height fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex shrink xs1 v-for="block in blocks" :key="block.id">
                    <block-tile
                        :block="block"
                        @showDetails="showDetails(block)">
                    </block-tile>
                </v-flex>
            </v-layout>
            <details-dialog
                :shown="areDetailsShown"
                :config="details"
                @close="closeDetails">
            </details-dialog>
        </v-container>
    </div>
</template>

<script>
    import BlockTile from '@/components/BlockTile'
    import DetailsDialog from '@/components/dialogs/DetailsDialog'
    import { BLOCKS, LOAD } from '@/store/constants'

    export default {
        name: 'Blocks',
        data: () => ({
            blocks: [],
            details: {
                title: 'Block',
                fields: []
            },
            areDetailsShown: false,
            blockFieldToTitle: {
                id: 'Id',
                num: 'Number',
                previousBlockId: 'Previous block id',
                stateHash: 'State hash',
            }
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
                for (const field in this.blockFieldToTitle) {
                    this.details.fields.push({
                        label: this.blockFieldToTitle[field],
                        value: block[field]
                    })
                }
                this.areDetailsShown = true
            },
            closeDetails () {
                this.areDetailsShown = false
                this.details.fields = []
            }
        },
        components: {
            BlockTile,
            DetailsDialog
        }
    }
</script>
