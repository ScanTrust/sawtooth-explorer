<template>
    <v-form>
        <v-text-field v-for="(value, i) in fieldsValues" :key="i" v-model="fieldsValues[i]" :label="label"></v-text-field>
        <v-btn outline icon color="blue darken-2" :disabled="fieldsValues.length > maxFieldsAmount" @click="addField">
            <v-icon>add</v-icon>
        </v-btn>
    </v-form>
</template>

<script>
export default {
    name: 'text-fields-list',
    data: () => ({
        fieldsValues: ['']
    }),
    props: {
        label: {
            type: String,
        },
        maxFieldsAmount: {
            type: Number,
            default: 2
        }
    },
    watch: {
        fieldsValues () {
            this.$emit('input', this.fieldsValues)
        }
    },
    methods: {
        addField () {
            this.fieldsValues.push('')
        }
    }
}
</script>

<style>

</style>
