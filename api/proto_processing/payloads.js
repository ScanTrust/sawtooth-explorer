'use strict'

const _ = require('lodash')
const protobuf = require('protobufjs')
const protoJson = require('./protos.json')

// Keys for payload actions
const ACTIONS = [
	"CREATE_ACCOUNT",
	"CREATE_ASSET",
	"CREATE_HOLDING",
	"CREATE_OFFER",
	// "CREATE_FEEDBACK",
	"ACCEPT_OFFER",
	"CLOSE_OFFER"
]

const titleify = allCaps => {
  return allCaps
    .split('_')
    .map(word => word[0] + word.slice(1).toLowerCase())
    .join('')
}

const actionMap = ACTIONS.reduce((map, enumName) => {
  const key = enumName[0].toLowerCase() + titleify(enumName).slice(1)
  const className = titleify(enumName)
  return _.set(map, key, { enum: enumName, name: className })
}, {})

const root = protobuf.Root.fromJSON(protoJson)
const TransactionPayload = root.lookup('TransactionPayload')
_.map(actionMap, action => {
  return _.set(action, 'proto', root.lookup(action.name))
})

const encode = (actionKey, actionData) => { //('createAsset', {})
  const action = actionMap[actionKey]
  if (!action) {
    throw new Error('There is no payload action with that key')
  }

  return TransactionPayload.encode({
    payloadType: TransactionPayload.PayloadType[action.enum],
    [actionKey]: action.proto.create(actionData)
  }).finish()
}

const actionMethods = _.reduce(actionMap, (methods, value, key) => {
  return _.set(methods, key, _.partial(encode, key))
}, {})

module.exports = _.assign({
  encode
}, actionMethods)
