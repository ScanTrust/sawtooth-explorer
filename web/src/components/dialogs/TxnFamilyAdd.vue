<template>
  <v-dialog v-model="shown" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Add Transaction Family</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-form v-model="dataIsCorrect" ref="form">
                  <v-flex xs12>
                  <v-text-field @keyup.enter="add" 
                                label="Address Prefix"
                                v-model="addressPrefix"
                                :rules="[rules.required, rules.addressPrefix]">
                  </v-text-field>
                  </v-flex>
                  <v-flex xs12>
                  <v-text-field @keyup.enter="add" 
                                label="Label"
                                v-model="label"
                                :rules="[rules.required, rules.minLength(4)]">
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
        <v-btn color="blue darken-1" flat @click.native="add" :disabled="!dataIsCorrect">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { rules } from '@/lib/validation-rules'

  export default {
    name: 'txn-family-add',
    data: () => ({
      addressPrefix: '',
      label: '',
      rules: rules,
      dataIsCorrect: false
    }),
    props: {
      shown: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: () => ({ })
      }
    },
    methods: {
      add () {
        this.$emit('add', {
          prefix: this.addressPrefix,
          label: this.label
        })
        this.close()
      },
      close () {
        this.$emit('close')
      }
    },
    watch: {
      shown () {
        this.$refs.form.reset()
      },
      data () {
        for (let field in data) {
          if (data[field]) {
            this[field] = data[field]
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
