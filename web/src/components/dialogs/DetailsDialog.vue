<template>
  <v-dialog v-model="shown" persistent max-width="420px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ configReceived.title }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
            <v-layout wrap v-if="configReceived.fields.length > 0">
                <template v-for="field in configReceived.fields">
                    <v-flex xs12 :key="`${field.label}-label`">
                    <span class="body-2">{{field.label}}</span>
                    </v-flex>
                    <v-flex xs11 mx-auto :key="`${field.label}-value`">
                    <span class="subheading">{{field.value}}</span>            
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
            shown: {
                type: Boolean,
                default: false
            },
            config: {
                type: Object,
                default: () => ({})
            },
        },
        computed: {
            configReceived () {
                if (Object.entries(this.config).length > 0) {
                    return this.config
                }
                return {
                    title: 'Unknown',
                    fields: []
                }
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