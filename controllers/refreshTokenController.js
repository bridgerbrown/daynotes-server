const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing' });

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.status(403).json({ message: 'User not found' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.status(403).json({ message: 'Invalid or expired refresh token' });

    const accessToken = jwt.sign(
      { "email": decoded.email, 
        "userId": decoded.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
