const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const handleLogin = async (req, res) => {
  console.log("Logging user in...");
  const { email, password } = req.body;
  console.log(`${email} and ${password}`);
  if (!email || !password) return res.status(400).json({
    'message': 'Username and password are required.'
  });

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { "email": foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    );
    const refreshToken = jwt.sign(
      { "email": foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  };
};

module.exports = { handleLogin };
