const http = require('./http')
const toBuffer = require('typedarray-to-buffer')
const { blockchain } = require('./config')

let StateElement = require('./models/stateElement');
let Block = require('./models/block');
let Transaction = require('./models/transaction');

function syncState (callback) {
  http.get(blockchain.REST_API_URL + blockchain.STATE_PATH, function (ok, stateBody) {
    if (!ok) return
    let stateElements = JSON.parse(stateBody).data
    stateElements.forEach((el) => { el.createdAt = new Date() })
    StateElement._create(stateElements, callback);
  })
}

// it's a separate func bc it's used in handling block-commit event
function transformBlockDataBeforeDB (blockData) {
  const transactions = []
  const block = {
    id: blockData["header_signature"],
    num: blockData["header"]["block_num"],
    stateHash: blockData["header"]["state_root_hash"],
    previousBlockId: blockData["header"]["previous_block_id"]
  }
  blockData["batches"].forEach((batch) => {
    batch["transactions"].forEach((txn) => {
      transactions.push({
        id: txn["header_signature"],
        blockId: blockData["header_signature"],
        batchId: batch["header_signature"],
        payload: txn["payload"],
        signerPublicKey: txn["header"]["signer_public_key"]
      })
    })
  })
  return { block, transactions }
}

function syncChainData (callback) {
  http.get(blockchain.REST_API_URL + blockchain.BLOCKS_PATH, function (ok, stateBody) {
    if (!ok) return
    let blocksData = JSON.parse(stateBody)["data"]
    let blocks = []
    let transactions = []
    blocksData.forEach((blockData) => {
      const { currentBlock, currentTxns } = transformBlockDataBeforeDB(blockData)
      blocks.push(currentBlock)
      transactions = transactions.concat(currentTxns)
    })
    Block._create(blocks, () => {
      Transaction._create(transactions, callback)
    });
  })
}

function syncDB (callback) {
  syncChainData(() => syncState(callback))
}


module.exports = { syncDB, transformBlockDataBeforeDB }
