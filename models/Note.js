const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  documentId: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
  },
  data: {
    type: Object
  },
  lastUpdated: {
    type: Date
  }
});

module.exports = mongoose.model('Note', noteSchema);
