let express = require('express');
let router = express.Router();
let Signer = require('@root/models/signer')
const { check, validationResult } = require('express-validator/check')
const passport = require('passport')

router.get('/', function(req, res, next) {
  const dbQuery = {}
  if (req.query.publicKeys) {
      const publicKeys = req.query.publicKeys.split(',')
      dbQuery["publicKey"] = {$in: publicKeys}
  }
  Signer._get(dbQuery, signers => {
      res.send(signers)
  })
});

router.post('/add', passport.authenticate('jwt', {session: false}), [
  check('publicKey').isLength({min: 66, max: 66}),
  check('label').exists()
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next()
})

router.post('/add', function(req, res, next) {
  Signer._create({
    publicKey: req.body.publicKey,
    label: req.body.label
  }, (ok, err) => { // ok: Bool, err: String
    res.json({ ok, err });
  })
});

module.exports = router;
