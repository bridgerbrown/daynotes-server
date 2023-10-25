const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (req.url === '/register') {
    return next();
  }

  if (!authHeader?.startsWith('Bearer ')) {
    console.log("No bearer in authHeader");
    return res.sendStatus(401);
  }

  const accessToken = authHeader.split(' ')[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.sendStatus(403);
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp - now < 300) {
      const refreshToken = req.headers['refresh-token'];
      if (!refreshToken) {
        console.log("Refresh token is missing");
        return res.sendStatus(401);
      }

      try {
        const response = await fetch('/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.status === 200) {
          const data = await response.json();
          req.accessToken = data.accessToken;
        } else {
          console.log("Failed to refresh the access token");
          return res.sendStatus(401);
        }
      } catch (err) {
        console.error("Error refreshing access token:", err);
        return res.sendStatus(500);
      }
    }
    req.email = decoded.email;
    next();
  });
};

module.exports = verifyJWT;
