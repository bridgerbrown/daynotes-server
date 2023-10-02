const express = require("express");
const app = express();
const { createServer } = require("http");
const socketHandler = require("./controllers/socketController");

const serverPort = process.env.PORT || 10000;

app.all('*', (req, res) => {
  return handle(req, res);
})

app.prepare().then(() => {
  const server = createServer(app);

  server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));

  module.exports = server;
  socketHandler(server);
});

app.get("/", (req, res) => {
  res.send("Server is live...");
});
