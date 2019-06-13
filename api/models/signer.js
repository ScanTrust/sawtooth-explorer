let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Signer = new Schema({
    publicKey: {
        type: String,
        unique: true
    },
    label: String
});

Signer = mongoose.model('Signer', Signer);

Signer._create = (signer, callback) => {
    Signer.create(signer, err => {
        if (err) {
            console.log("Err on creating signer:", err);
            if (err.code == 11000 && callback)
                return callback(false, "has_signer_with_such_public_key")
        }
        if (callback)
            callback(true)
    });
};

Signer._upsert = function (signer, callback) {
    Signer.findOneAndUpdate({
        publicKey: signer.publicKey
    }, signer, { upsert: true }, callback)
}

function upsertAll(signers, callback) {
    if (signers.length > 0) {
        let signer = signers.shift()
        Signer._upsert(signer, () => upsertAll(signers, callback))
    } else if (callback) {
        return callback()
    }
}

Signer._upsertAll = upsertAll;

Signer._get = function (params, callback) {
    Signer.find(params, function (err, signers) {
        if (err)
            console.log("Err on getting from signers:", err);
        callback(signers);
    });
}

Signer._getByPublicKey = (publicKey, callback) => {
    Signer.findOne({publicKey}, (err, signer) => {
        if (err)
            console.log('Err on finding signer by publicKey:', err);
        callback(signer);
    });
};

Signer._remove = (signers, callback) => {
    let query = {
        '$or': signers.map(signer => ({publicKey: signer.publicKey}))
    }
    Signer.remove(query, (err) => {
        if (err)
            console.log(err)
        if (callback)
            callback()
    })
}

module.exports = Signer;
