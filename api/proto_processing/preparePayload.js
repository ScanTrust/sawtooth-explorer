/*
This code was written by Bormisov Vlad @bormisov.
*/

'use strict'

const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const context = createContext('secp256k1')
const cbor = require('cbor')
const { createHash } = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const hash = require('hash.js')

function preparePayload(payload, privateKey) {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex')
    const signer = new CryptoFactory(context).newSigner({ privateKeyBytes: privateKeyBuffer })
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: 'marketplace'
        , familyVersion: '1.0'
        , signerPublicKey: signer.getPublicKey().asHex()
        , batcherPublicKey: signer.getPublicKey().asHex()
        , inputs: ['cd6744']
        , outputs: ['cd6744']
        , payloadSha512: createHash('sha512').update(payload).digest('hex')
    }).finish()
    const signature = signer.sign(transactionHeaderBytes)
    const transaction1 = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payload
    })
    const transactions = [transaction1]
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()
    const signature1 = signer.sign(batchHeaderBytes)
    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: signature1,
        transactions: transactions
    })
    const batchListBytes = protobuf.BatchList.encode({
        batches: [batch]
    }).finish()

    return batchListBytes
}

module.exports = preparePayload