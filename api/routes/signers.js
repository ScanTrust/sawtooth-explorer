let express = require('express');
let router = express.Router();
let Signer = require('@root/models/signer')

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

module.exports = router;
