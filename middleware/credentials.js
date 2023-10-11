const credentials = (req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGIN;
  const origin = req.headers.origin;

  const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  const effectiveOrigin = isLocal ? 'http://localhost' : origin;

  if (allowedOrigins.includes(effectiveOrigin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
}

module.exports = credentials;
