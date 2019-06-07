const uuid = require('uuid4')

const preparePayload = require('./preparePayload');

const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()

const request = require('request')

const payloads = require('./payloads')

console.log(payloads)

let offer = payloads.createOffer({
	id: uuid(),
	label: 'c3_0',
	description: 'c3',
	rules: [
		{
			type: 202,
			value: Buffer.from("031657d48951e05c2063efe8370bcebc79be86853887cb3eec7f56f25e68bc6469")
		}, {
			type: 200
		}
	],
	source: '41826645-b562-41db-a739-9d0ab853ae2d',
	sourceQuantity: 10,
	target: null
})

let holdingId = uuid()
console.log({holdingId})
let holding = payloads.createHolding({
	"id": holdingId
	, "label": "c3"
	, "description": "c3"
	, "asset": "c3"
	, "quantity": 500
})

let asset = payloads.createAsset({
	"name": "c3"
	, "description": "c3"
})

let account = payloads.createAccount({
	"label": "c3"
	, "description": "c3"
})

// const privateKeyHex = privateKey.asHex()
const privateKeyHex = '72fa0e84c5fea3832fa06b70e14ec6c3e2b1c2c667eab50c08ad5a78550db9e2'

console.log({privateKeyHex})

request.post({
    url: 'http://localhost:82/batches',
    body: preparePayload(offer, privateKeyHex),
    headers: {'Content-Type': 'application/octet-stream'}
}, (err, response) => {
    if (err) return console.log(err)
    console.log(response.body)
})