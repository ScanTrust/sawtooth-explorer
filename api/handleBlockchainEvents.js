const http = require('./http')

const { decodeSingleStateElData, decodeSingleTransaction, getProtoName } = require('./proto_processing/decoding')
const { decodeStateChangeList } = require('./proto_processing/eventsEncoding')
const { blockchain } = require('./config')
// const { fixAsset, fixHolding, fixOffer, fixMakeTransfer, fixMutualPayoff } = require('./syncStateDB')
const { requestEventCatchUp } = require('./blockchainEventsWorker')
const { transformBlockDataBeforeDB } = require('./syncDB')

const Block = require('./models/block');
const Transaction = require('./models/transaction');
const StateElement = require('./models/stateElement');

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

let blocksProcessesQueue = []

function getAndHandleActualBlock (blockCommit) {
  let block = {}
  blockCommit.attributes.forEach(attr => {
    block[attr.key] = attr.value
  })
  console.log('before handling', block['block_num'])
  blocksProcessesQueue.push(function (hasUnprocessedBlocks) {
    Block._getWithMaxNumber(function (maxNumberBlock) {
      console.log('handling', block['block_num'])
      if (maxNumberBlock && maxNumberBlock.id != block["previous_block_id"]/* && !hasUnprocessedBlocks*/) {
        console.log('catching up on received block')
        return requestEventCatchUp(blockchain, [maxNumberBlock.id])
      }
      const url = blockchain.BLOCKS_PATH + "/" + block["block_id"]
      http.get(url, function (ok, blockInfoJSON) {
        if (!ok) return;
        const blockInfo = JSON.parse(blockInfoJSON)
        const {block, transactions} = transformBlockDataBeforeDB(blockInfo)
        Block._create(block, () => {
          Transaction._create(transactions)
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

setInterval(processNextInQueue, 500)

module.exports = {
  // stateDelta: saveStateDelta,
  // blockCommit: handleBlockCommit
  stateDelta: handleDelta,
  blockCommit: getAndHandleActualBlock
}
