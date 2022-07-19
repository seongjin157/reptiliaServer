const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  username: String,
  userId: mongoose.Types.ObjectId,
  postId: mongoose.Types.ObjectId,
  comment: String,
  writeDate: {
    type: Date,
    default: Date.now,
  },
});

const comment = mongoose.model('comment', commentSchema);

module.exports = comment;
