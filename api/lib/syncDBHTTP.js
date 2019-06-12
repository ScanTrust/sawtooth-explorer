const http = require('./common/http')
const toBuffer = require('typedarray-to-buffer')
const { blockchain } = require('@root/config')
const { transformBlockDataBeforeDB } = require('@root/lib/events/handlers')

let StateElement = require('@root/models/stateElement');
let Block = require('@root/models/block');
let Transaction = require('@root/models/transaction');

function syncState (callback) {
  http.get(blockchain.REST_API_URL + blockchain.STATE_PATH, function (ok, stateBody) {
    if (!ok) return
    let stateElements = JSON.parse(stateBody).data
    stateElements.forEach((el) => { el.createdAt = new Date() })
    StateElement._upsertAll(stateElements, callback);
  })
}

function syncChainData (callback) {
  http.get(blockchain.REST_API_URL + blockchain.BLOCKS_PATH, function (ok, stateBody) {
    if (!ok) return
    let blocksData = JSON.parse(stateBody)["data"]
    let blocks = []
    let transactions = []
    blocksData.forEach((blockData) => {
      const { block: currentBlock, transactions: currentTxns } = transformBlockDataBeforeDB(blockData)
      blocks.push(currentBlock)
      transactions = transactions.concat(currentTxns)
    })
    Block._upsertAll(blocks, () => {
      Transaction._upsertAll(transactions, callback)
    });
  })
}

function syncDB (callback) {
  syncChainData(() => syncState(callback))
}

module.exports = { syncDB }
