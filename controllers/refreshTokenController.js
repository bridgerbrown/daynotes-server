const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.error("Error verifying refresh token:", err);
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        { "email": decoded.email, 
          "userId": decoded.userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ accessToken })
    }
  );
};

module.exports = { handleRefreshToken };
