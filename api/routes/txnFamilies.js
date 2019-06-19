let express = require('express');
let router = express.Router();
const { check, validationResult } = require('express-validator/check')
const passport = require('passport')

let TxnFamily = require('@root/models/txnFamily')

router.get('/', function(req, res, next) {
    const dbQuery = {}
    if (req.query.prefixes) {
        const prefixes = req.query.prefixes.split(',')
        dbQuery["addressPrefix"] = {$in: prefixes}
    }
    TxnFamily._get(dbQuery, txnFamilies => {
        res.send(txnFamilies)
    })
});

router.post('/add', passport.authenticate('jwt', {session: false}), [
    check('prefix').isLength({min: 6, max: 6}),
    check('label').exists()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ ok: false, message: 'incorrect_data', errors: errors.array() });
    }
    next()
})

router.post('/add', function(req, res, next) {
    TxnFamily._create({
        addressPrefix: req.body.prefix,
        label: req.body.label
    }, (ok, msg) => {
        res.status(ok ? 200 : 500).json({ ok, message: msg });
    })
});

router.post('/edit', function(req, res, next) {
  TxnFamily._upsert({
    addressPrefix: req.body.addressPrefix,
    label: req.body.label
  }, (ok, msg) => {
    return res.status(ok ? 200 : 500).json({ ok, message: msg })
  })
});

module.exports = router;
