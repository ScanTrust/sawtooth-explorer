<template>
    <div>
        <manage-rule-dialog
            v-if="shownRuleIndex !== null"
            :rule="shownRule"
            :ruleIndex="shownRuleIndex"
            :shown="ruleDialogShown"
            @ruleChanged="completeAndReplaceRule"
            @close="ruleDialogShown = false">
        </manage-rule-dialog>
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex xs12>
                    <v-layout wrap>
                        <v-flex xs12>
                            <span class="unselectable headline">Configure Transaction Family</span>
                        </v-flex>
                        <v-flex xs12 ml-4>
                            <v-select
                                :items="txnFamilyLabels"
                                v-model="txnFamilyLabel"
                                label="Transaction Family"
                                @change="txnFamilyChanged">
                            </v-select>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 v-show="this.txnFamilyLabel != null">
                    <v-layout wrap>
                        <v-flex xs12>
                            <span class="unselectable headline">Upload Protobuf Files</span>
                        </v-flex>
                        <v-flex xs10 ml-4>
                            <files-uploader
                                v-if="txnFamilyLabel"
                                :txnFamilyLabel="txnFamilyLabel"
                                :shownFileNames="uploadedFileNames"
                                @filesChanged="handleFilesChange" />
                        </v-flex>
                        <v-flex xs1>
                            <v-btn
                                color="blue darken-1"
                                outline
                                @click="uploadFiles"
                                :disabled="!canUpload">
                                Upload
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap>
                        <v-flex xs12>
                            <span class="unselectable headline">Transaction Payload</span>
                        </v-flex>
                        <v-flex xs12 ml-4>
                            <p class="unselectable subheading">Choose encoding type:</p>
                            <v-radio-group v-model="transactionPayloadEncodingType">
                                <v-radio
                                    v-for="encodingType in encodingTypes"
                                    :key="encodingType"
                                    :label="encodingType.toLowerCase()"
                                    :value="encodingType"
                                ></v-radio>
                            </v-radio-group>
                            <v-select
                                v-show="transactionPayloadEncodingType === ENCODING_TYPES.PROTO"
                                :items="protoMessages"
                                label="Protobuf Message"
                                v-model="transactionPayloadProtoName">
                            </v-select>
                        </v-flex>
                        <v-flex xs12>
                            <span class="unselectable headline">State Elements Decoding Rules</span>
                        </v-flex>
                        <v-flex xs12 ml-4>
                            <p class="unselectable subheading">Choose encoding type:</p>
                            <v-radio-group v-model="stateElementsEncodingType">
                                <v-radio
                                    v-for="encodingType in encodingTypes"
                                    :key="encodingType"
                                    :label="encodingType.toLowerCase()"
                                    :value="encodingType"
                                ></v-radio>
                            </v-radio-group>
                            <v-layout align-center wrap v-show="stateElementsEncodingType === ENCODING_TYPES.PROTO">
                                <v-flex xs4 v-for="(rule, i) in rules" :key="i">
                                    <entity-tile
                                        :type="DECODING_RULE"
                                        :entity="rule"
                                        :clickEvent="'clicked'"
                                        @clicked="showEditRuleDialog(i, rule)">
                                        <template v-slot:action>
                                            <v-btn flat icon @click="rules.splice(i, 1)">
                                                <v-icon>close</v-icon>
                                            </v-btn>
                                        </template>
                                    </entity-tile>
                                </v-flex>
                                <v-flex xs1>
                                    <v-btn fab dark small color="indigo lighten-1" @click="showAddRuleDialog()">
                                        <v-icon dark>add</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs2 offset-xs10>
                            <v-btn color="blue darken-1" flat @click="saveRules">Save Rules</v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { mapGetters } from 'vuex'

    import EntityTile from '@/components/EntityTile.vue'
    import ManageRuleDialog from '@/components/dialogs/ManageRuleDialog.vue'
    import FilesUploader from '@/components/FilesUploader.vue'
    import {
        PROTO,
        UPLOAD,
        SAVE_RULES,
        TXN_FAMILIES,
        ENCODING_TYPES,
        DECODING_RULE,
    } from '@/store/constants'
    import { sha512 } from '@/lib/common'

    export default {
        name: 'proto-settings',
        data: () => ({
            files: null,
            canUpload: false,
            txnFamilyLabel: null,
            transactionPayloadEncodingType: 'NONE',
            stateElementsEncodingType: 'NONE',
            transactionPayloadProtoName: null,
            rules: [],
            uploadedFileNames: null,
            uploadAvailable: false,
            shownRuleIndex: null,
            shownRule: null,
            ruleDialogShown: false,

            ENCODING_TYPES,
            DECODING_RULE
        }),
        methods: {
            loadTxnFamilySettings (txnFamilyLabel) {
                const fileNames = this.txnFamilyPrefixToFileNames[this.txnFamilyPrefix]
                if (Array.isArray(fileNames) && fileNames.length > 0) {
                    this.uploadedFileNames = fileNames
                    const txnFamilySettings = this.txnFamilyPrefixToSettings[this.txnFamilyPrefix]
                    if (txnFamilySettings) {
                        const { txnPayloadEncodingType, stateElementsEncodingType } = txnFamilySettings
                        this.transactionPayloadEncodingType = txnPayloadEncodingType
                        this.stateElementsEncodingType = stateElementsEncodingType
                    }
                    // deal with the rest of the txn-family related settings in rulesConfig
                    if (!this.rulesConfig)
                        return this.rules = []
                    const txnPayloadProto = this.rulesConfig.transactionPayloadProtoName
                    if (txnPayloadProto) {
                        this.transactionPayloadProtoName = txnPayloadProto
                    }
                    const protoNameToRules = this.rulesConfig.protoNameToRules
                    if (protoNameToRules) {
                        this.rules = []
                        for (let protoName in protoNameToRules) {
                            this.rules.push(
                                ...protoNameToRules[protoName].map(rule => {
                                    const hash = sha512(protoName)
                                    return {
                                        hash,
                                        protoName,
                                        ...rule
                                    }
                                })
                            )
                        }
                    }
                }
            },
            handleFilesChange (files) {
                this.files = files
                this.uploadedFileNames = []
                for (let i = 0; i != files.length; i++)
                    this.uploadedFileNames[i] = files[i].name
                this.canUpload = files.length > 0
            },
            async uploadFiles () {
                await this.$store.dispatch(PROTO + UPLOAD, {
                    files: this.files,
                    txnFamilyPrefix: this.txnFamilyPrefix
                })
                this.canUpload = false
                this.loadTxnFamilySettings(this.txnFamilyLabel)
            },
            txnFamilyChanged (txnFamilyLabel) {
                this.loadTxnFamilySettings(txnFamilyLabel)
            },
            showEditRuleDialog (i, rule) {
                this.shownRuleIndex = i
                this.shownRule = rule
                this.ruleDialogShown = true
            },
            showAddRuleDialog () {
                this.shownRuleIndex = this.rules.length
                this.shownRule = {}
                this.ruleDialogShown = true
            },
            completeAndReplaceRule ({index, rule}) {
                if (!rule)
                    return Vue.set(this.rules, index, null)
                rule.hash = sha512(rule.protoName)
                Vue.set(this.rules, index, rule)
            },
            saveRules () {
                let transactionPayloadProtoName
                if (this.transactionPayloadEncodingType === ENCODING_TYPES.PROTO) {
                    transactionPayloadProtoName = this.transactionPayloadProtoName
                }
                let rules = []
                if (this.stateElementsEncodingType === ENCODING_TYPES.PROTO) {
                    rules = this.rules.map(rule => {
                        for (let field in rule) {
                            if (rule[field] === null)
                                delete rule[field]
                        }
                        return Object.assign({}, rule)
                    })
                }
                this.$store.dispatch(PROTO + SAVE_RULES, {
                    txnFamilyPrefix: this.txnFamilyPrefix,
                    rules,
                    transactionPayloadProtoName,
                    txnPayloadEncodingType: this.transactionPayloadEncodingType,
                    stateElementsEncodingType: this.stateElementsEncodingType,
                })
            }
        },
        computed: {
            ...mapGetters(TXN_FAMILIES, ['txnFamilies']),
            ...mapGetters(PROTO, [
                'txnFamilyPrefixToSettings',
                'protoMessages',
                'txnFamilyPrefixToRulesConfig',
                'txnFamilyPrefixToFileNames'
            ]),
            encodingTypes () {
                return Object.keys(ENCODING_TYPES)
            },
            txnFamilyLabels () {
                return this.txnFamilies.map(family => family.label)
            },
            txnFamilyPrefix () {
                return this.txnFamilies.find(family => family.label == this.txnFamilyLabel).addressPrefix
            },
            rulesConfig () {
                const res = this.txnFamilyPrefixToRulesConfig[this.txnFamilyPrefix]
                if (res)
                    return res
                return null
            }
        },
        components: {
            FilesUploader,
            EntityTile,
            ManageRuleDialog,
        }
    }
</script>

<style scoped>
    span {
        color:#8091d8
    }
</style>
