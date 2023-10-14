const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleUserData = async (req, res) => {
  console.log("Fetching user data...");
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      'message': 'User info not provided.'
    });
  }

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) {
    return res.status(404).json({
      'message': 'User not found;'
    });
  }
  res.json({ user: foundUser });
};

module.exports = { handleUserData };
