let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Block = new Schema({
  id: String,
  num: Number,
  stateHash: String,
  previousBlockId: String
});

Block = mongoose.model('Block', Block);

Block._create = (block, callback) => {
    Block.create(block, err => {
      if (err)
        console.log("Err on creating block:", err);
      if (callback)
        callback()
    });
};

Block._get = function (params, callback) {
  Block.find(params, function (err, blocks) {
    if (err)
      console.log("Err on getting from blocks:", err);
    callback(blocks);
  });
}

Block._getByNumber = (num, callback) => {
  Block.findOne({num}, (err, block) => {
    if (err)
      console.log('Err on finding block by number:', err);
    callback(block);
  });
};

Block._remove = (blocks, callback) => {
  let query = {
    '$or': blocks.map(block => ({id: block.id}))
  }
  Block.remove(query, (err) => {
    if (err)
      console.log(err)
    if (callback)
      callback()
  })
}

Block._getWithMaxNumber = (callback) => {
  Block
    .findOne({})
    .sort('-num')
    .exec(function (err, block) {
      if (err)
        console.log(err)
      callback(block)
    })
}

Block._getAscSortedByNumber = (callback) => {
  Block.find({}, null, {sort: {num: -1}}, function (err, blocks) {
    if (err)
      console.log(err)
    callback(blocks)
  })
}

module.exports = Block;
