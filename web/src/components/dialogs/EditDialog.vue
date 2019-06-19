<template>
  <v-dialog v-model="shown" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
            <v-layout wrap v-if="uneditableFields.length > 0">
                <template v-for="field in uneditableFields">
                    <v-flex xs12 :key="`${field.name}-label`">
                        <span class="body-2">{{field.label}}</span>
                    </v-flex>
                    <v-flex xs11 mx-auto :key="`${field.name}-value`">
                        <span class="subheading">{{data[field.name] || 'Unknown'}}</span>
                    </v-flex>
                </template>
            </v-layout>
            <v-layout wrap v-if="editableFields.length > 0">
                <v-flex xs12>
                    <v-form v-model="dataIsCorrect" ref="form">
                        <v-flex xs12 v-for="field in editableFields" :key="field.name">
                            <v-text-field @keyup.enter="edit" 
                                        :label="field.label"
                                        v-model="editedData[field.name]"
                                        :rules="field.rules">
                            </v-text-field>
                        </v-flex>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="edit" :disabled="!dataIsCorrect">Edit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import { EventBus } from '@/lib/event-bus'

    export default {
        name: 'edit-dialog',
        data: () => ({
            editedData: {},
            dataIsCorrect: false,
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
            data: {
                type: Object,
                default: null
            },
            uneditableFields: {
                type: Array,
                default: () => []
            },
            editableFields: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            shown () {
                if (this.$refs.form)
                    this.$refs.form.reset()
            },
            uneditableFields () {
                this.uneditableFields.forEach(field => {
                    this.editedData[field.name] = this.data[field.name]
                })
            },
            editableFields () {
                this.editableFields.forEach(field => {
                    this.editedData[field.name] = this.data[field.name]
                })
            }
        },
        computed: {
            displayedFields () {
                const result = []
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
                this.$emit('edit', this.editedData)
                this.close()
            },
            close () {
                this.$emit('close')
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