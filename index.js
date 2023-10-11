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
const serverPort = process.env.PORT || 10000;

connectDb();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);

app.all('*', (req, res) => {
  res.redirect('/404');
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirnamme, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found')
  }
});

app.use(errorHandler);

connectToDatabase();

mongoose.connection.once('open', () => {
  const server = createServer(app);
  const io = require('socket.io')(server, {
    cors: {
      origin: "*:*",
      methods: ["GET", "POST"],
    }
  });
  const initializeSocketHandler = require("./controllers/socketController")
  initializeSocketHandler(io);
  server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));
});

module.exports = server;
