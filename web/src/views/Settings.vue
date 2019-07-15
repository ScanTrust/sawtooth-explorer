<template>
    <div class="pos-relative height-85-prc">
        <v-container fluid pa-5 grid-list-xl>
            <v-layout wrap>
                <v-flex xs12>
                    <v-layout wrap>
                        <v-flex xs12>
                            <span class="unselectable headline">Setup Transaction Family</span>
                        </v-flex>
                        <v-flex xs12 ml-4>
                            <v-select
                                :items="txnFamilyLabels"
                                v-model="txnFamilyLabel"
                                label="Select a transaction family to setup decoder"
                                @change="txnFamilyChanged">
                            </v-select>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 v-show="setupStep >= 1">
                    <v-layout wrap>
                        <v-flex xs12>
                            <span class="unselectable headline">Upload Protos</span>
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
                </v-flex>
                <v-flex xs12 v-show="setupStep >= 2">
                    <v-layout wrap>
                        <v-flex xs12>
                            <span class="unselectable headline">Transaction Payload</span>
                        </v-flex>
                        <v-flex xs12 ml-4>
                            <v-select
                                :items="protoMessages"
                                label="Select transaction payload proto message"
                                v-model="transactionPayloadProtoName">
                            </v-select>
                        </v-flex>
                        <v-flex xs12>
                            <span class="unselectable headline">State Elements Decoding Rules</span>
                        </v-flex>
                        <v-flex xs12 ml-4>
                            <v-layout>
                                <v-flex xs1>
                                    <v-layout column fill-height justify-space-between>
                                        <v-flex xs1>
                                            <v-icon @click="rules.push({})">
                                                add
                                            </v-icon>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-icon @click="rules.pop()">
                                                remove
                                            </v-icon>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs10>
                                    <v-layout wrap>
                                        <v-flex xs6 v-for="(rule, i) in rules" :key="2 * i">
                                            <rule-form
                                                :rule="rule"
                                                @ruleChanged="replaceRule(i, $event)">
                                            </rule-form>
                                        </v-flex>
                                    </v-layout>
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

    import RuleForm from '@/components/RuleForm.vue'
    import FilesUploader from '@/components/FilesUploader.vue'
    import {
        PROTO,
        UPLOAD,
        SAVE_RULES,
        TXN_FAMILIES,
    } from '@/store/constants'

    export default {
        name: 'Settings',
        data: () => ({
            files: null,
            filesSetUp: false,
            canUpload: false,
            txnFamilyLabel: null,
            transactionPayloadProtoName: null,
            rules: [],
            uploadedFileNames: null,
            uploadAvailable: false,
        }),
        methods: {
            loadTxnFamilySettings (txnFamilyLabel) {
                const fileNames = this.txnFamilyPrefixToFileNames[this.txnFamilyPrefix]
                if (Array.isArray(fileNames) && fileNames.length > 0) {
                    this.uploadedFileNames = fileNames
                    this.filesSetUp = true
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
                                ...protoNameToRules[protoName].map(rule => ({
                                    protoName,
                                    ...rule
                                }))
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
                this.filesSetUp = false
                this.canUpload = files.length > 0
            },
            async uploadFiles () {
                await this.$store.dispatch(PROTO + UPLOAD, {
                    files: this.files,
                    txnFamilyPrefix: this.txnFamilyPrefix
                })
                this.filesSetUp = true
                this.canUpload = false
                this.loadTxnFamilySettings(this.txnFamilyLabel)
            },
            txnFamilyChanged (txnFamilyLabel) {
                this.loadTxnFamilySettings(txnFamilyLabel)
            },
            replaceRule (i, rule) {
                Vue.set(this.rules, i, rule)
            },
            saveRules () {
                const rules = this.rules.map(rule => {
                    for (let field in rule) {
                        if (rule[field] === null)
                            delete rule[field]
                    }
                    return Object.assign({}, rule)
                })
                this.$store.dispatch(PROTO + SAVE_RULES, {
                    txnFamilyPrefix: this.txnFamilyPrefix,
                    rules,
                    transactionPayloadProtoName: this.transactionPayloadProtoName
                })
            }
        },
        computed: {
            ...mapGetters(TXN_FAMILIES, ['txnFamilies']),
            ...mapGetters(PROTO, ['protoMessages', 'txnFamilyPrefixToRulesConfig', 'txnFamilyPrefixToFileNames']),
            txnFamilyLabels () {
                return this.txnFamilies.map(family => family.label)
            },
            txnFamilyPrefix () {
                return this.txnFamilies.find(family => family.label == this.txnFamilyLabel).addressPrefix
            },
            setupStep () {
                if (!this.txnFamilyLabel) {
                    return 0
                }
                if (!this.filesSetUp) {
                    return 1
                }
                return 2
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
            RuleForm,
        }
    }
</script>

<style scoped>
    span {
        color:#8091d8
    }
</style>

