const mongoose = require('mongoose');
require('dotenv').config();

const mongoDbUri = process.env.MONGODB_CONNECTION_STRING;

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    return db;
  } catch (err) {
    console.log(err);
  };
}

module.exports = connectToDatabase;
