const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, POST, PUT, DELETE, OPTIONS', 
  allowedHeaders: 'Content-Type',
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
