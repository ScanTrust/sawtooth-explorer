const atob = require('atob')
const protos = require('./protos')

const transactionPayloadTypeNumberToName = {
  1: 'CreateAccount',
  2: 'CreateAccount',
  3: 'CreateAsset',
  4: 'CreateHolding',
  5: 'CreateOffer',
  10: 'AcceptOffer',
  11: 'CloseOffer',
  12: 'MakeTransfer',
  13: 'CreateSettings',
  14: 'ModifyAccountAdminStatus',
  15: 'ModifyAccountIssuanceStatus',
  16: 'AddTrustedKey',
  17: 'RemoveTrustedKey',
  18: 'ModifyHolding',
  19: 'MutualPayoff'
}

const protoNames = [
  { name: 'OfferHistory', start: 0, end: 1 }
  , { name: 'Settings', start: 1, end: 2 }
  , { name: 'Asset', start: 2, end: 50 }
  , { name: 'Holding', start: 50, end: 125 }
  , { name: 'Account', start: 125, end: 200 }
  , { name: 'Offer', start: 200, end: 256 }
]

const getProtoName = address => {
  const addressesSpace = parseInt(address.slice(6, 8), 16)
  return protoNames.find(proto => (proto.start <= addressesSpace && addressesSpace < proto.end)).name
}

const base64ToBinary = base64 => {
  const raw = atob(base64);
  const rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const decode = ({encoded, callback, decodeSingle}) => {
  if (!protos["AssetContainer"]) {
    console.log('No proto loaded yet, trying again in a sec')
    return setTimeout(decode, 1000, encoded, callback)
  }
  let inputIsArray = true
  if (!Array.isArray(encoded)) {
    inputIsArray = false
    encoded = [encoded]
  }
  const decoded = encoded.map(decodeSingle)
  callback(inputIsArray ? decoded : decoded[0] )
}

function decodeSingleTransaction (txnPayload) {
  return protos["TransactionPayload"].decode(base64ToBinary(txnPayload))
}

const decodeTransactions = (encoded, callback) => {
  return decode({
    encoded: encoded,
    callback: decoded => {
      let transactionsData = {}
      decoded.forEach((decodedTransaction, i) => {
        const payloadTypeNumber = decodedTransaction.payloadType
        if (![10, 12, 19].includes(payloadTypeNumber)) return;
        payloadTypeName = transactionPayloadTypeNumberToName[payloadTypeNumber]
        transactionsData[payloadTypeName] = transactionsData[payloadTypeName] || []
        transactionsData[payloadTypeName].push(Object(decodedTransaction[lowerCaseFirstLetter(payloadTypeName)]))
      })
      callback(transactionsData)
    },
    decodeSingle: decodeSingleTransaction
  })
}

function decodeSingleStateElData (el) {
  return getProtoName(el.address) != "Settings" 
      ? protos[`${getProtoName(el.address)}Container`]
          .decode(typeof el.data === 'string' ? base64ToBinary(el.data) : el.data)
          .entries
          .map(entry => {
            entry.address = el.address
            return entry
          })
      : []
}

const decodeState = (encoded, callback) => {
  return decode({
    encoded: encoded,
    callback: decoded => {
      let stateData = {}
      decoded.forEach((decodedStateEl, i) => {
        decodedStateEl.forEach(containerEl => {
          stateData[containerEl.constructor.name] = stateData[containerEl.constructor.name] || []
          stateData[containerEl.constructor.name].push(Object(containerEl))
        })
      })
      callback(stateData)
    },
    decodeSingle: decodeSingleStateElData
    })
}

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = { decodeState, decodeTransactions, decodeSingleStateElData, decodeSingleTransaction, getProtoName }
