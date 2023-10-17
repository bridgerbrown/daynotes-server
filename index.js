const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectToDatabase = require('./config/dbConn');
const { createServer } = require("http");
const serverPort = 10000;

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(logger);

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));

app.use(credentials);
app.use(verifyJWT);
app.use('/user', require('./routes/user'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));



app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found')
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  const server = createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });
  const initializeSocketHandler = require("./controllers/socketController")
  initializeSocketHandler(io);
  server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));
  module.exports = server;
});

