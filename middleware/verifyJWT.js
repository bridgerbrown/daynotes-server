const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("authHeader: " + authHeader);
  console.log(req.query.email);
  if (req.url === '/register') {
    return next();
  }

  if (!authHeader?.startsWith('Bearer ')) {
    console.log("No bearer in authHeader");
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.email = decoded.email;
      next();
    }
  );
};

module.exports = verifyJWT;
