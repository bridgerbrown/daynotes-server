const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET, HEAD, POST, PUT, DELETE, OPTIONS', 
  allowedHeaders: 'Content-Type',
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
