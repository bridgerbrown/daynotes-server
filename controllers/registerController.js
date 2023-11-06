const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');

const handleNewUser = async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !password) return res.status(400).json({
    'message': 'Username and password are required.'
  });

  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const memberSinceDate = format(new Date(), 'M/dd/yyyy');
    await User.create({
      "email": email,
      "username": username,
      "password": hashedPwd,
      "userId": uuidv4(),
      "userImage": "/user.png",
      "memberSince": memberSinceDate.toString(),
    });

    res.status(201).json({ 'success': `New user ${username} created.`});
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  };
};

module.exports = { handleNewUser };
