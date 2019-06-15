let express = require('express');
let router = express.Router();
let Block = require('@root/models/block')
let Transaction = require('@root/models/transaction')

router.get('/', function(req, res, next) {
    req._dbQuery = {$and: []}
    if (req.query.ids) {
        const ids = req.query.ids.split(',')
        req._dbQuery["$and"].push({id: {$in: ids}})
    }
    if (req.query.txnIds) {
        const txnIds = req.query.txnIds.split(',')
        Transaction._get({id: {$in: txnIds}}, txns => {
            const txnsBlockIds = txns.map(txn => txn.blockId)
            req._dbQuery["$and"].push({id: {$in: txnsBlockIds}})
            next()
        })
    } else {
        next()
    }
})

router.get('/', function(req, res, next) {
    if (req.query.recentN) {
        const amountOfBlocks = parseInt(req.query.recentN)
        Block._getWithMaxNumber(maxNumBlock => {
            req._dbQuery["num"] = {$gt: maxNumBlock.num - amountOfBlocks}
            next()
        })
    } else {
        next()
    }
})

router.get('/', function(req, res, next) {
    Block._get(req._dbQuery, blocks => {
        res.send(blocks)
    })
})


module.exports = router;
