<template>
  <v-dialog v-model="shown" persistent max-width="420px">
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
                        <span v-if="field.value" class="subheading">{{field.value}}</span>
                        <slot v-else             :name="field.slotName"></slot>
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
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
            detailsData: {
                type: Object,
                default: () => ({})
            },
            fieldToTitle: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            displayedFields () {
                const result = []
                for (const field in this.fieldToTitle) {
                    if (typeof this.fieldToTitle[field] === 'string') {
                        result.push({
                            label: this.fieldToTitle[field],
                            value: this.detailsData[field]
                        })
                    } else {
                        result.push({
                            label: this.fieldToTitle[field].label,
                            slotName: this.fieldToTitle[field].slotName
                        })
                    }
                }
                return result
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