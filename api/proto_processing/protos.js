'use strict'

const path = require('path')
const _ = require('lodash')
const protobuf = require('protobufjs')

let protos = {}

const loadProtos = (filename, protoNames) => {
  const protoPath = path.resolve(__dirname, './assets/protos', filename)
  return protobuf.load(protoPath)
    .then(root => {
      protoNames.forEach(name => {
        protos[name] = root.lookupType(name)
      })
    })
}

const compile = () => {
  return Promise.all([
    loadProtos('account.proto', [
      'Account',
      'AccountContainer'
    ]),
    loadProtos('asset.proto', [
      'Asset',
      'AssetContainer'
    ]),
    loadProtos('holding.proto', [
      'Holding',
      'HoldingContainer'
    ]),
    loadProtos('offer.proto', [
      'Offer',
      'OfferContainer'
    ]),
    loadProtos('offer_history.proto', [
      'OfferHistory',
      'OfferHistoryContainer'
    ]),
    loadProtos('payload.proto', [
      'TransactionPayload',
      'CreateAccount',
      'CreateAsset',
      'CreateHolding',
      'CreateOffer',
      'AcceptOffer',
      'CloseOffer',
      'MakeTransfer',
      'CreateSettings',
      'ModifyAccountAdminStatus',
      'ModifyAccountIssuanceStatus',
      'AddTrustedKey',
      'RemoveTrustedKey'
    ]),
    loadProtos('rule.proto', [
      'Rule'
    ])/*,
    loadProtos('events.proto', [
      'ClientEventsSubscribeResponse',
      'ClientEventsSubscribeRequest',
      'EventSubscription',
      'EventFilter'
    ])*/
  ])
}

module.exports = _.assign(protos, { compile })
