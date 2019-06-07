let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StateElement = new Schema({
    address: String,
    data: String,
    createdAt: Date,
    transactionId: String
});

StateElement = mongoose.model('StateElement', StateElement);

StateElement._create = (stateElement, callback) => {
    StateElement.create(stateElement, err => {
        if (err)
            console.log("Err on creating stateElement:", err);
        if (callback)
            callback()
    });
};

StateElement._get = function (params, callback) {
    StateElement.find(params, function (err, stateElements) {
        if (err)
            console.log("Err on getting from stateElements:", err);
        callback(stateElements);
    });
}

StateElement._getLatestOnAddress = (address, callback) => {
  StateElement
    .findOne({address})
    .sort('-createdAt')
    .exec(function (err, stateElement) {
        if (err)
            console.log(err)
        callback(stateElement)
    })
}

StateElement._getHistoryOfAddress = (address, callback) => {
    StateElement.find({address}, null, {sort: {createdAt: -1}}, function (err, stateElements) {
        if (err)
            console.log(err)
        callback(stateElements)
    })
}

module.exports = StateElement;
