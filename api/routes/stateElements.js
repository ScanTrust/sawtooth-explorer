let express = require('express');
let router = express.Router();
let StateElement = require('@root/models/stateElement')

router.get('/', function(req, res, next) {
    const dbQuery = {}
    if (req.query.addresses) {
        const prefixes = req.query.addresses.split(',')
        dbQuery["address"] = {$in: prefixes.map(pref => new RegExp('^' + pref, 'i'))}
    }
    if (req.query.txnIds) {
        const txnIds = req.query.txnIds.split(',')
        dbQuery["transactionId"] = {$in: txnIds}
    }
	if (req.query.since) {
        const sinceDate = new Date(parseInt(req.query.since));
		dbQuery["createdAt"] = {$gte: sinceDate} 
	}
    StateElement._get(dbQuery, stateElemets => {
        res.send(stateElemets)
    })
});

module.exports = router;
