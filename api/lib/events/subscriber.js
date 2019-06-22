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

let handlingCatchUp = false;
let justStartedCatchUp = false;
let lastStateDeltaHandleDate = null;

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
					const secondsSinceLastStateDeltaHandle = (new Date() - lastStateDeltaHandleDate) / 1000
					if (!justStartedCatchUp && secondsSinceLastStateDeltaHandle > 0.1)
						handlingCatchUp = false
					lastStateDeltaHandleDate = new Date()
					justStartedCatchUp = false
					const correspondingBlockId = events[i - 1].attributes[0].value
					if (!correspondingBlockId)
						console.log(
							"Didn't have corresponging block id:",
							events[i - 1],
							events[i - 1].attributes,
							events[i - 1].attributes[0]
						)
					handlers.stateDelta(events[i], correspondingBlockId, !handlingCatchUp)
				}
			}
		}
	})
	Block._getWithMaxNumber(function (maxNumberBlock) {
		maxNumberBlock = maxNumberBlock || {id: '0000000000000000'} // initial block id
		console.log(`subscribing for ${validatorUrl} block-commit events and requesting event catch-up since block`, maxNumberBlock)
		requestEventCatchUp([maxNumberBlock.id], callback)
	})
}

function requestEventCatchUp (lastKnownBlockIds, callback) {
	handlingCatchUp = true
	justStartedCatchUp = true
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
