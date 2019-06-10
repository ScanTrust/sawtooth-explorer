let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Transaction = new Schema({
    id: String,
    blockId: String,
    batchId: String,
    payload: String,
    signerPublicKey: String,
});

Transaction = mongoose.model('Transaction', Transaction);

Transaction._create = (transaction, callback) => {
    Transaction.create(transaction, err => {
      if (err)
        console.log("Err on creating transaction:", err);
      if (callback)
        callback()
    });
};

Transaction._upsert = function (transaction, callback) {
    Transaction.findOneAndUpdate({
      id: transaction.id
    }, transaction, { upsert: true }, callback)
}

function upsertAll(transactions, callback) {
  if (transactions.length > 0) {
    let transaction = transactions.shift()
    Transaction._upsert(transaction, () => upsertAll(transactions, callback))
  } else if (callback) {
    return callback()
  }
}

Transaction._upsertAll = upsertAll;

Transaction._get = function (params, callback) {
  Transaction.find(params, function (err, transactions) {
    if (err)
      console.log("Err on getting from transactions:", err);
    callback(transactions);
  });
}

Transaction._getLatestOnAddress = (address, callback) => {
  Transaction
    .findOne({address})
    .sort('-createdAt')
    .exec(function (err, transaction) {
      if (err)
        console.log(err)
      callback(transaction)
    })
}

Transaction._getHistoryOfAddress = (address, callback) => {
  Transaction.find({address}, null, {sort: {createdAt: -1}}, function (err, transactions) {
    if (err)
      console.log(err)
    callback(transactions)
  })
}

module.exports = Transaction;
