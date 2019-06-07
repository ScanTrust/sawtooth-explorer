const http = require('./http')

let FCMTokens = require('./models/FCMTokens');
let Holding = require('./models/holding');

const FCM_URL = "https://fcm.googleapis.com/fcm/send";
const FCM_SERVER_KEY = "AAAAecUxmI8:APA91bEFpmUMmct4yEZkjO4ebYX_NyvQuQ4CGu2n9NMEUuXSguwLLaggVTZyHNQ1wPVi-E3mW-OYCuaTePnvc9s-6EF9eq1CVRtti4kIjhBTfsaSY6MrilqpZVP0YjgcBCrUgLuWDhpE";
const PAYOFF_TITLE = "Произведен взаимозачет"
const TRANSFER_TITLE = "Поступление средств"
const KEY_IMPORT_TITLE = "Оповещение безопасности"

function notifyAboutPayoff (payoff) {
	const message = `Вы получили ${payoff.initiatorWithdrawalQuantity} ${payoff.initiatorWithdrawalAsset} и отдали ${payoff.initiatorReceivingQuantity} ${payoff.initiatorReceivingAsset}`
	getPublicKeyByHoldingId(payoff.ownerWithdrawalHoldingId, function (pubKey) {
		FCMTokens._getByPublicKey(pubKey, function (tokensDoc) {
			tokensDoc = tokensDoc || { tokens: [] }
			notifyAll(tokensDoc.tokens, PAYOFF_TITLE, message)
		})
	})
}

function notifyAboutTransfer (transfer) {
	const message = `Вы получили ${transfer.quantity} ${transfer.asset}`
	FCMTokens._getByPublicKey(transfer.target, function (tokensDoc) {
		tokensDoc = tokensDoc || { tokens: [] }
		notifyAll(tokensDoc.tokens, TRANSFER_TITLE, message)
	})
}

function notifyAboutKeyImport (publicKey) {
	const message = `Ключ ${publicKey.slice(0, 7)}... был импортирован на другом устройстве`
	FCMTokens._getByPublicKey(publicKey, function (tokensDoc) {
		tokensDoc = tokensDoc || { tokens: [] }
		notifyAll(tokensDoc.tokens, KEY_IMPORT_TITLE, message)
	})
}

function getPublicKeyByHoldingId (holdingId, callback) {
	Holding._getById(holdingId, function (holding) {
		let pubKey;
		if (holding)
			pubKey = holding.account
		callback(pubKey)
	})
}

function notify (token, title, body) {
	http.post(FCM_URL, FCM_SERVER_KEY, {
		notification: {title, body},
		priority: "high",
		data: {
			click_action: "FLUTTER_NOTIFICATION_CLICK",
			id: "1",
			status: "done"
		},
		to: token
	}, function (ok, res) {
		console.log(ok, res)
		if (res.results[0].error == "NotRegistered")
			FCMTokens._removeToken(token)
	})
}

function notifyAll (tokens, title, body) {
	if (tokens.length == 0)
		return;
	const token = tokens.shift()
	notify(token, title, body)
	notifyAll(tokens, title, body)
}

module.exports = { notifyAboutPayoff, notifyAboutTransfer, notifyAboutKeyImport }
