const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    id: Number,
    username: String,
    passHash: String,
    salt: String,
    role: Number // 0 - usual user, 1 - admin
});

User = mongoose.model('User', User)

User._create = (user, callback) => {
  User.create(user, err => {
    if (err) {
      console.log("Err on creating user:", err);
      if (err.code == 11000 && callback)
        return callback(false, "has_user_with_such_username")
    }
    if (callback)
      callback(true)
  });
};

User._getById = (id, callback) => {
  User.findOne({id}, (err, user) => {
    if (err)
      console.log('Err on finding user by username:', err);
    callback(user, err);
  });
};

User._getByUsername = (username, callback) => {
  User.findOne({username}, (err, user) => {
    if (err)
      console.log('Err on finding user by username:', err);
    callback(user);
  });
};

User._getLastId = (callback) => {
  User
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .exec((err, user) => {
        if (err)
        console.log('Err on getting last user id:', err);
        callback(user[0] ? user[0].id : 0);
    });
}

module.exports = User;