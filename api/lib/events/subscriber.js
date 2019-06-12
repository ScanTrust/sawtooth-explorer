const Block = require('@root/models/block');

const {
	encodeValidatorMessage,
	encodeSubscribeRequest,
	encodeUnsubscribeRequest,
	encodeSubscription,
	encodeFilter,

	decodeValidatorMessage,
	decodeSubscribeResponse,
	decodeUnsubscribeResponse,
	decodeEventsList
} = require('./encoding')

const { blockchain } = require('@root/config')

const zmq = require('zeromq')
let blockchainSocket

function subscribeToBlockchainEvents (handlers, callback) {
	blockchainSocket = zmq.socket('dealer')
	const validatorUrl = blockchain.VALIDATOR_URL
	blockchainSocket.connect(validatorUrl)
	blockchainSocket.on('message', function (msg) {
		const message = decodeValidatorMessage(msg)
		if (message.messageType == 501) {
			const data = decodeSubscribeResponse(message.content)
			if (data.status == 1)
				console.log('successfuly subscribed to ' + validatorUrl + ' events')
			else
				console.log('subscription to ' + validatorUrl + ' failed')
		} else if (message.messageType == 503) {
			const data = decodeUnsubscribeResponse(message.content)
			if (data.status == 1)
				console.log('successfuly unsubscribed to ' + validatorUrl + ' events')
			else
				console.log('unsubscription to ' + validatorUrl + ' failed')
		} else {
			const events = decodeEventsList(message.content).events
			// this is to be replaced
			for (let i = 0; i != events.length; i++) {
				if (i % 2 == 0) {
					handlers.blockCommit(events[i])
				} else {
					const correspondingBlockId = events[i - 1].attributes[0].value
					handlers.stateDelta(events[i], correspondingBlockId)
				}
			}
		}
	})
	Block._getWithMaxNumber(function (maxNumberBlock) {
		maxNumberBlock = maxNumberBlock || {id: '0000000000000000'} // initial block id
		console.log(`subscribing for ${validatorUrl} block-commit events and requesting event catch-up since block: ${maxNumberBlock}`)
		blockchainSocket.send(makeSubReqMessage([maxNumberBlock.id]), undefined, callback)
	})
}

function requestEventCatchUp (lastKnownBlockIds, callback) {
	blockchainSocket.send(
		makeSubReqMessage(lastKnownBlockIds),
		undefined,
		callback
	)
}

function makeSubReqMessage (lastKnownBlockIds) {
	const subscribeRequest = encodeSubscribeRequest([
		encodeSubscription('sawtooth/state-delta'),
		encodeSubscription('sawtooth/block-commit')
	], lastKnownBlockIds)
	return subscribeRequestMessage = encodeValidatorMessage(500, '123', subscribeRequest)
}

function unsubscribeToBlockchainEvents (blockchain, callback) {
	const unsubscribeRequest = encodeUnsubscribeRequest()
	const message = encodeValidatorMessage(502, '123', unsubscribeRequest)
	blockchainSocket.send(message, undefined, callback)
}

module.exports = {
	subscribeToBlockchainEvents,
	requestEventCatchUp
}
