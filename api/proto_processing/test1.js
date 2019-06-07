const Blockchain = require('../blockchain')

const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey().asHex()

Blockchain.createAccount({
	data: {
		"label": "MegaVlad"
		, "description": "It's the MegaVlad's account! Send me money btch!"
	}
	, privateKey
}, res => {
	console.log(res)
})