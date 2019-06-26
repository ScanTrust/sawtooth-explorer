<template>
    <v-dialog v-model="shown" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ title }}</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap v-if="displayedFields.length > 0">
                        <template v-for="field in displayedFields">
                            <v-flex xs12 :key="`${field.label}-label`">
                                <span class="unselectable color-grey">{{field.label}}</span>
                            </v-flex>
                            <v-flex xs11 mx-auto :key="`${field.label}-value`">
                                <slot v-if="field.tagName" :name="field.detailsType"></slot>
                                <span v-else class="subheading">{{field.value != undefined ? field.value : 'Unknown'}}</span>
                            </v-flex>
                        </template>
                    </v-layout>
                    <v-layout wrap v-else justify-center align-center fill-height>
                        <v-flex xs4>
                            <h3 class="unselectable color-grey">No data :(</h3>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <template v-if="changeable">
                    <v-btn v-if="dataPresent" color="blue darken-1" flat @click.native="edit">Edit</v-btn>
                    <v-btn v-else color="blue darken-1" flat @click.native="add">Add</v-btn>
                </template>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="$emit('close')">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { EventBus } from '@/lib/event-bus'
    import { SHOW_EDIT, SHOW_ADD } from '@/store/constants'
    import { entityNameToConfig } from '@/lib/display-config'

    export default {
        name: 'details-dialog',
        data: () => ({

        }),
        props: {
            title: {
                type: String,
                default: 'Unknown'
            },
            shown: {
                type: Boolean,
                default: false
            },
            changeable: {
                type: Boolean,
                default: false
            },
            dataPresent: {
                type: Boolean,
                default: false
            },
            detailsData: {
                type: Object,
                default: null
            },
            fieldNameToLabel: {
                type: Object,
                default: () => ({})
            },
            fieldNameToEntityName: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            displayedFields () {
                const result = []
                for (const field in this.fieldNameToLabel) {
                    if (!this.detailsData) {
                        result.push({
                            label: this.fieldNameToLabel[field],
                            value: 'Unknown'
                        })
                        continue
                    }
                    const label = this.fieldNameToLabel[field]
                    const slotEntityName = this.fieldNameToEntityName[field]
                    if (slotEntityName) {
                        const slotConfig = entityNameToConfig[slotEntityName].tileSlotConfig
                        result.push({
                            label: label,
                            tagName: slotConfig.tagName,
                            detailsType: slotConfig.detailsType
                        })
                    } else {
                        result.push({
                            label: label,
                            value: this.detailsData[field]
                        })
                    }
                }
                return result
            }
        },
        methods: {
            edit () {
                EventBus.$emit(SHOW_EDIT, { data: this.detailsData })
            },
            add () {
                EventBus.$emit(SHOW_ADD, { data: this.detailsData })
            }
        }
    }
</script>

<style scoped>
  .subheading {
    overflow-wrap: break-word;
  }
</style>