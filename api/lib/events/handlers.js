const http = require('@root/lib/common/http')

const { decodeStateChangeList } = require('./encoding')
const { blockchain } = require('@root/lib/common/config')
const { requestEventCatchUp } = require('./subscriber')

const Block = require('@root/models/block');
const Transaction = require('@root/models/transaction');
const StateElement = require('@root/models/stateElement');

/*
let lastBlocksTree = {}
let blockIdsTree = {}
let stateDeltas = {}

function removeBlockAndDescendantsExceptId (removedBlockId, id) {
  const removedBlock = lastBlocksTree[removedBlockId]
  delete lastBlocksTree[removedBlockId]
  blockIdsTree[removedBlockId].forEach(descendantBlockId => {
    if (descendantBlockId != id)
      removeBlockAndDescendantsExceptId(descendantBlockId, '')
  })
  return removedBlock
}

function addLeafBlockAndPopTopBlock (block) {
  const prevBlockId = block.previous_block_id
  lastBlocksTree[block.block_id] = block;
  if (!blockIdsTree[prevBlockId])
    blockIdsTree[prevBlockId] = []
  blockIdsTree[prevBlockId].push(block.block_id)

  const maxHeight = 5
  let currentBlock = block
  let expectedCurrentHeight = 0
  currentBlock.height = 0
  let visitedDescendantBlockId = ''
  while (currentBlock && (!currentBlock.height || currentBlock.height == expectedCurrentHeight)) {
    if (currentBlock.height == maxHeight) {
      return removeBlockAndDescendantsExceptId(currentBlock, visitedDescendantBlockId)
    }
    expectedCurrentHeight += 1
    visitedDescendantBlockId = currentBlock.block_id
    currentBlock = lastBlocksTree[block.previous_block_id]
  }
  return undefined
}

function saveStateDelta (blockchainId, stateDelta, correspondingBlockId) {
  const stateChangeList = decodeStateChangeList(stateDelta.data).stateChanges
  stateDeltas[correspondingBlockId] = stateChangeList.map(delta => {
    delta.value = decodeSingleStateElData({
      data: delta.value,
      address: delta.address
    })[0]
    return delta
  })
}

function handleBlockCommit (blockchainId, blockCommit) {
  let block = {}
  blockCommit.attributes.forEach(attr => {
    block[attr.key] = attr.value
  })
  const topBlock = addLeafBlockAndPopTopBlock(block)
  if (topBlock)
    applyDeltasToDB(blockchainId, stateDeltas[topBlock.block_id])
}*/

function handleDelta (stateDelta, correspondingBlockId) {
  const stateChangeList = decodeStateChangeList(stateDelta.data).stateChanges
  const stateElements = stateChangeList.map(delta => ({ // delta = {value: .., address: .., type: ..}
    address: delta.address,
    data: delta.type == 1 ? delta.value : null,
    createdAt: new Date(),
    transactionId: null // maybe it should have blockId instead...
  }))
  StateElement._create(stateElements)
}

// it's a separate func bc it's used in handling POST on /blocks
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

let blocksProcessesQueue = []

function getAndHandleActualBlock (blockCommit) {
  let block = {}
  blockCommit.attributes.forEach(attr => {
    block[attr.key] = attr.value
  })
  console.log('before handling', block['block_num'])
  blocksProcessesQueue.push(function (hasUnprocessedBlocks) {
    Block._getWithMaxNumber(function (maxNumberBlock) {
      Block._getById(block["block_id"], function (receivedBlockFromDB) {
        console.log('handling', block['block_num'])
        const receivedBlockIsSequent = maxNumberBlock && maxNumberBlock.id != block["previous_block_id"]
        if ((receivedBlockFromDB || receivedBlockIsSequent) && !hasUnprocessedBlocks) {
          console.log('catching up on received block')
          return requestEventCatchUp([maxNumberBlock.id])
        }
        const url = blockchain.REST_API_URL + blockchain.BLOCKS_PATH + "/" + block["block_id"]
        http.get(url, function (ok, blockInfoJSON) {
          if (!ok) return;
          const blockInfo = JSON.parse(blockInfoJSON)["data"]
          const {block, transactions} = transformBlockDataBeforeDB(blockInfo)
          Block._upsert(block, () => {
            Transaction._upsertAll(transactions)
          })
        })
      })
    })
  })
}

function processNextInQueue () {
  const processFunc = blocksProcessesQueue.shift()
  if (processFunc)
    processFunc(blocksProcessesQueue.length > 0)
}

setInterval(processNextInQueue, 100)

module.exports = {
  // stateDelta: saveStateDelta,
  // blockCommit: handleBlockCommit
  stateDelta: handleDelta,
  blockCommit: getAndHandleActualBlock,
  transformBlockDataBeforeDB
}
