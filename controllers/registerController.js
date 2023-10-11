const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');


const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({
    'message': 'Username and password are required.'
  });

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    await User.create({
      "username": user,
      "password": hashedPwd,
      "userId": uuidv4(),
      "userImage": "/user.png",
      "memberSince": new Date(),
    });

    res.status(201).json({ 'success': `New user ${user} created.`});
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  };
};

module.exports = { handleNewUser };
