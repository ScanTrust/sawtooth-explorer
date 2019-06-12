let express = require('express');
let router = express.Router();
let Transaction = require('@root/models/transaction')

router.get('/', function(req, res, next) {
	const dbQuery = {}
	if (req.query.ids) {
		const ids = req.query.ids.split(',')
		dbQuery["id"] = {$in: ids}
	}
	if (req.query.batchIds) {
		const batchIds = req.query.batchIds.split(',')
		dbQuery["batchId"] = {$in: batchIds}
	}
	if (req.query.blockIds) {
		const blockIds = req.query.blockIds.split(',')
		dbQuery["blockId"] = {$in: blockIds}
	}
	if (req.query.signer) {
		dbQuery["signerPublicKey"] = req.query.signer 
	}
	if (req.query.since) {
        const sinceDate = new Date(parseInt(req.query.since));
		dbQuery["createdAt"] = {$gte: sinceDate} 
	}
	Transaction._get(dbQuery, transactions => {
		res.send(transactions)
	})
});

module.exports = router;
