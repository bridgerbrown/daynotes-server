const User = require('../models/User');
const jwt = require('jsonwebtoken'); // You need the JWT library for token validation

const handleLogout = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.sendStatus(401); 
  }

  const accessToken = authorizationHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(accessToken, 'your-secret-key');
    const refreshToken = decodedToken.refreshToken;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      return res.sendStatus(204); 
    }

    foundUser.refreshToken = '';
    const result = await foundUser.save();

    return res.sendStatus(204); 
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogout };
