const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
  },
  memberSince: {
    type: Date
  },
  refreshToken: String
});

module.exports = mongoose.model('User', userSchema);
