const corsOptions = {
  origin: [
    'wss://daynotes-client.vercel.app',
    'https://daynotes-client.vercel.app',
    'http://daynotes-client.vercel.app',
    'https://daynotes-server.onrender.com',
    'http://daynotes-server.onrender.com'
  ],
  methods: 'GET, HEAD, POST, PUT, DELETE, OPTIONS', 
  allowedHeaders: 'Content-Type',
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
