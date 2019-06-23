<template>
    <v-form>
        <v-layout justify-end wrap>
            <template v-for="(value, i) in fieldsValues">
                <v-flex :key="i" :xs12="i == 0" :xs11="i > 0">
                    <v-text-field
                        v-model="fieldsValues[i]" :label="label">
                        <v-icon
                            v-if="i == 0" slot="prepend"
                            @click="maxFieldsExceeded ? null : addField()"
                            :style="{ cursor: maxFieldsExceeded ? 'default' : 'pointer' }">
                            add
                        </v-icon>
                    </v-text-field>
                </v-flex>
            </template>
        </v-layout>
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
            default: 3
        }
    },
    watch: {
        fieldsValues () {
            this.$emit('input', this.fieldsValues)
        }
    },
    computed: {
        maxFieldsExceeded () { return this.fieldsValues.length >= this.maxFieldsAmount }
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
