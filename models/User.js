const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {type: String, required: true},
    password: {type: String, required: true},
    friendRequestsFrom: [
      {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    friends: [
      {type: Schema.Types.ObjectId, ref: 'User'}
    ],
    facebookId: {type: String}
  }
);

module.exports = mongoose.model('User', userSchema);