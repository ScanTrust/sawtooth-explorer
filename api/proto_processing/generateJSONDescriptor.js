'use strict'

const path = require('path')
const _ = require('lodash')
const protobuf = require('protobufjs')

let protos = {}

const loadProtos = (filename, protoNames) => {
//  const protoPath = path.resolve(__dirname, './assets/protos', filename)
  const protoPath = path.resolve('', './assets/protos', filename)
  return protobuf.load(protoPath)
    .then(root => {
      protoNames.forEach(name => {
        protos[name] = root.lookupType(name)
      })
    })
}

const filesToMessagesNames = {
  'account.proto': [
    'Account',
    'AccountContainer'
  ],
  'asset.proto': [
    'Asset',
    'AssetContainer'
  ],
  'holding.proto': [
    'Holding',
    'HoldingContainer'
  ],
  'offer.proto': [
    'Offer',
    'OfferContainer'
  ],
  'offer_history.proto': [
    'OfferHistory',
    'OfferHistoryContainer'
  ],
  'payload.proto': [
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
  ],
  'rule.proto': [
    'Rule'
  ],
  'events.proto': [
    'ClientEventsSubscribeResponse',
    'ClientEventsSubscribeRequest',
    'ClientEventsUnsubscribeRequest',
    'ClientEventsUnsubscribeResponse',
    'EventSubscription',
    'EventFilter',
    'Message',
    'Event',
    'EventList',
    'StateChange',
    'StateChangeList'
  ]
}

const compile = () => {
  let promises = []
  for (let fileName in filesToMessagesNames) {
    promises.push(loadProtos(fileName, filesToMessagesNames[fileName]))
  }
  return Promise.all(promises)
}

compile().then(() => {
  let messagesNames = [];
  for (let fileName in filesToMessagesNames) {
    filesToMessagesNames[fileName].forEach((messageName) => messagesNames.push(messageName))
  }
  let res = { }
  messagesNames.forEach((messageName) => {
    res[messageName] = protos[messageName].toJSON()
  });
  console.log(JSON.stringify({ "nested": res }));
})
