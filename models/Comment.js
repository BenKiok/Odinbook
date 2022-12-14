const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    body: {type: String, required: true},
    date: {type: Number, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    likedBy: [
      {type: Schema.Types.ObjectId, ref: 'User'}
    ]
  }
);

module.exports = mongoose.model('Comment', commentSchema);