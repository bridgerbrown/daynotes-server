const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  documentId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  data: {
    type: Object
  },
  lastUpdated: {
    type: Date
  }
});

module.exports = mongoose.model('Note', noteSchema);
