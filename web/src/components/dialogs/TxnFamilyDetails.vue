<template>
  <v-dialog v-model="shown" persistent max-width="420px">
    <v-card>
      <v-card-title>
        <span class="headline">Transaction Family</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <span class="body-2">Address Prefix</span>
            </v-flex>
            <v-flex xs11 mx-auto>
              <span class="subheading">{{addressPrefix}}</span>            
            </v-flex>
            <v-flex xs12>
              <span class="body-2">Label</span>
            </v-flex>
            <v-flex xs11 mx-auto>
              <span class="subheading">{{label}}</span>
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
    name: 'txn-family-details',
    data: () => ({
    
    }),
    props: {
      shown: {
        type: Boolean,
        default: false
      },
      addressPrefix: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
    },
    methods: {
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