<template>
  <v-dialog v-model="shown" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Specify Filters</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
                {{$route.path}}
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click.native="apply">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { rules } from '@/lib/validation-rules'

  export default {
    name: 'filters-dialog',
    data: () => ({

    }),
    props: {
      shown: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      apply () {
        this.close()
      },
      close () {
        this.$emit('close')
      }
    },
  }
</script>

<style scoped>

</style>
