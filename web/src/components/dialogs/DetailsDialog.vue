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
                                <span class="body-2">{{field.label}}</span>
                            </v-flex>
                            <v-flex xs11 mx-auto :key="`${field.label}-value`">
                                <slot v-if="field.tagName" :name="field.tagName"></slot>
                                <span v-else class="subheading">{{field.value || 'Unknown'}}</span>
                            </v-flex>
                        </template>
                    </v-layout>
                    <v-layout wrap v-else justify-center align-center fill-height>
                        <v-flex xs4>
                            <h3 style="color: grey" class="unselectable">No data :(</h3>
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
            fieldNameToContent: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            displayedFields () {
                const result = []
                console.log(this.detailsData)
                for (const field in this.fieldNameToContent) {
                    if (!this.detailsData) {
                        result.push({
                            label: this.fieldNameToContent[field],
                            value: 'Unknown'
                        })
                        continue
                    }
                    if (typeof this.fieldNameToContent[field] === 'string') {
                        result.push({
                            label: this.fieldNameToContent[field],
                            value: this.detailsData[field]
                        })
                    } else {
                        result.push({
                            label: this.fieldNameToContent[field].label,
                            tagName: this.fieldNameToContent[field].tagName
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
  .body-2 {
    color: grey;
  }

  .subheading {
    overflow-wrap: break-word;
  }
</style>