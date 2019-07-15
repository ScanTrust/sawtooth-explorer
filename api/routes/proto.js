const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')
// const { check, validationResult } = require('express-validator/check')

const Message = require('@root/models/message')
const { isAdmin } = require('@root/authentication')
const { saveAndReloadProtos, listDirProtoFiles, protosDirectoryPath, getMessages, getJSONDescriptor } = require('@root/lib/proto_processor')

router.get('/', async function(req, res, next) {
    const filePaths = await listDirProtoFiles(protosDirectoryPath)
    const txnFamilyPrefixToFileNames = {}
    filePaths.forEach(path => {
        const splitted = path.split('/')
        const txnFamilyPrefix = splitted[splitted.length - 2]
        const fileName = splitted[splitted.length - 1]
        txnFamilyPrefixToFileNames[txnFamilyPrefix] = txnFamilyPrefixToFileNames[txnFamilyPrefix] || []
        txnFamilyPrefixToFileNames[txnFamilyPrefix].push(fileName)
    })
    const descriptorJSON = await getJSONDescriptor()
    txnFamilyPrefixToRulesConfig = await Message._getTxnFamilyPrefixToRulesConfig()
    res.status(200).json({
        descriptor: descriptorJSON,
        txnFamilyPrefixToFileNames,
        txnFamilyPrefixToRulesConfig,
    })
})

router.get('/messages', async function(req, res, next) {
    const messages = await Message._getNames()
    res.status(200).json(messages)
})

router.use([isAdmin, fileUpload()])

router.post('/', async function(req, res, next) {
    const txnFamilyPrefix = req.body.txnFamilyPrefix
    if (!req.files)
        res.status(400).json({ok: false, message: 'no_files_received'})
    const files = Object.entries(req.files)
                        .map(file => file[1])
                        .filter(file => file.name.endsWith('.proto'))
    // saveAndReloadProtos saves them as files and generates and writes new JSON descriptor
    // and also fills it's scope's variable protos one is able to get with getMessages()
    try {
        await saveAndReloadProtos({txnFamilyPrefix, files})
    } catch (error) {
        return next(error)
    }
    const protoMessages = getMessages()
    const messages = protoMessages.map(protoName => ({
        name: protoName,
        txnFamilyPrefix: protoName == "Setting" ? "000000" : txnFamilyPrefix
    }))
    // saves Messages data to db
    await Promise.all([
        Message._removeAll().catch(err => next(err)),
        Message._create(messages).catch(err => next(err))
    ]).catch(err => next(err))
    res.status(200).json({ok: true, message: 'protos_uploaded_and_processed_successfully'})
})

router.post('/messages', async function(req, res, next) {
    const { txnFamilyPrefix, transactionPayloadProtoName } = req.body
    const messageToRules = req.body.messages
    await Message._updateRules({txnFamilyPrefix, messageToRules, transactionPayloadProtoName})
    res.status(200).json({ok: true, message: 'updated_rules_successfully'})
})

module.exports = router
