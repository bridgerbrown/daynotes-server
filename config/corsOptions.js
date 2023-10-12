const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS', 
  allowedHeaders: 'Content-Type',
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
