const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const { createServer } = require("http");
const socketHandler = require("./controllers/socketController");

const serverPort = process.env.PORT || 10000;

app.all('*', (req, res) => {
  return handle(req, res);
})

app.prepare().then(() => {
  const server = createServer(app);

  server.listen(serverPort, () => console.log(`Listening on ${serverPort}`));
  socketHandler(server);
});

app.get("/", (req, res) => {
  res.send("Server is live...");
});
