const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleUserData = async (req, res) => {
  console.log("Fetching user data...");
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({
      'message': 'User info not provided.'
    });
  }

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) {
    return res.status(404).json({
      'message': 'User not found'
    });
  }
  res.json({ user: foundUser });
};

const updateUserImage = async (req, res) => {
  console.log("Updating users image...");
  const { email, newImage } = req.body;
  try {
    const foundUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { userImage: newImage } },
      { new: true }
    );

    if (!foundUser) {
      return res.status(404).json({
        'message': 'User not found'
      });
    }
    res.status(200).json(foundUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { handleUserData, updateUserImage };
