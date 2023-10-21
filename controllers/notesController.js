const Note = require('../models/Note');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleNotesData = async (req, res) => {
  const { email, userId } = req.query;
  if (!email || !userId) {
    return res.status(400).json({
      'message': 'User info not provided.'
    });
  }
  
  try {
    const usersNotes = await Note.find({ email, userId });
    res.json({ usersNotes: usersNotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      'message': 'Error fetching user notes.'
    });
  }
};

module.exports = { handleNotesData };
