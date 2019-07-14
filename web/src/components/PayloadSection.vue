<template>
    <v-container pt-0 pl-0 pr-0>
        <v-layout wrap class="box-shadow">
            <v-flex xs12 pt-3>
                <v-layout justify-end>
                    <template v-for="(name, i) in representationsNames">
                        <v-flex
                            xs1
                            class="representation-label subheading"
                            :class="{
                                'selected-representation': name == currentRepresentationName,
                                'border-right': i < representationsNames.length - 1,
                            }"
                            @click="selectRepresentation(name)"
                            :key="name">
                            {{name}}
                        </v-flex>
                    </template>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-flex
                    v-if="rawlyShownRepresentations.includes(currentRepresentationName)"
                    xs12 class="raw-representation">
                    {{currentRepresentation}}
                </v-flex>
                <v-flex v-if="currentRepresentationName == JSON_REPRESENTATION_NAME" xs12>
                    <json-viewer :value="currentRepresentation" :expand-depth="5"></json-viewer>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import JsonViewer from 'vue-json-viewer'
    import 'vue-json-viewer/style.css'

    import {
        RAW_REPRESENTATION_NAME,
        JSON_REPRESENTATION_NAME,
        CBOR_REPRESENTATION_NAME,
    } from '@/lib/display-config'

    const representationNameToLabel = {
        [RAW_REPRESENTATION_NAME]: 'raw',
        [JSON_REPRESENTATION_NAME]: 'JSON',
        [CBOR_REPRESENTATION_NAME]: 'cbor',
    }

    export default {
        name: 'payload-section',
        data: () => ({
            rawlyShownRepresentations: [
                RAW_REPRESENTATION_NAME,
                CBOR_REPRESENTATION_NAME
            ],
            currentRepresentation: null,
            currentRepresentationName: null,

            RAW_REPRESENTATION_NAME,
            JSON_REPRESENTATION_NAME,
            CBOR_REPRESENTATION_NAME,
        }),
        props: {
            [RAW_REPRESENTATION_NAME]: {
                type: String,
                required: true,
            },
            [JSON_REPRESENTATION_NAME]: {
                type: Object,
                default: null,
            },
            [CBOR_REPRESENTATION_NAME]: {
                type: Object,
                default: null,
            },
        },
        created () {
            this.selectRepresentation(RAW_REPRESENTATION_NAME)
        },
        methods: {
            selectRepresentation (name) {
                this.currentRepresentation = this.representations[name]
                this.currentRepresentationName = name
            }
        },
        computed: {
            // non empty repr-props
            representations () {
                const res = {}
                Object.keys(representationNameToLabel).forEach(reprName => {
                    if (this[reprName])
                        res[reprName] = this[reprName]
                })
                return res
            },
            representationsNames () {
                return Object.keys(this.representations)
            },
        },
        components: {
            JsonViewer
        }
    }
</script>

<style scoped>
    .representation-label {
        cursor: pointer;
        text-align: center;
        color: #666;
    }

    .border-right {
        border-right: 1px solid black
    }

    .raw-representation {
        overflow-wrap: break-word;
        margin: 20px;
    }

    .selected-representation {
        color: black;
    }
</style>
