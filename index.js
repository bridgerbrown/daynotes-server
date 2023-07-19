const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { Server } = require("socket.io");

const app = express();
app.use(express.static("public"));

app.use(
  cors({
    origin: "https://daynotes-client.vercel.app",
    methods: ["GET", "POST"],
  })
);

const serverPort = process.env.PORT || 3000;
const server = http.createServer(app);
const wss =
  process.env.NODE_ENV === "production"
    ? new WebSocket.Server({ server })
    : new WebSocket.Server({ port: 5001 });
const io = new Server(server);

server.listen(serverPort);
console.log(`Server started on port ${serverPort} in stage ${process.env.NODE_ENV}`);

let keepAliveId;

const mongodbstring = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(mongodbstring);
let database;

async function connectToDatabase() {
  if (!database) {
    await client.connect();
    database = client.db("daynotes");
  }
  return database;
}

const keepServerAlive = () => {
  keepAliveId = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send("ping");
      }
    });
  }, 50000);
};

async function startServer() {
  try {
    await connectToDatabase();
    wss.on("connection", (ws, req) => {
      console.log("Connection Opened");
      console.log("Client size: ", wss.clients.size);

      if (wss.clients.size === 1) {
        console.log("first connection. starting keepalive");
        keepServerAlive();
      }

      ws.on("message", (data) => {
        let stringifiedData = data.toString();
        if (stringifiedData === "pong") {
          console.log("keepAlive");
          return;
        }
        broadcast(ws, stringifiedData, false);
      });

      ws.on("close", (data) => {
        console.log("closing connection");

        if (wss.clients.size === 0) {
          console.log("last client disconnected, stopping keepAlive interval");
          clearInterval(keepAliveId);
        }
      });
    });

    function broadcast(ws, message, includeSelf) {
      if (includeSelf) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      } else {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    }

    io.on("connect", (socket) => {
      socket.on("get-document", async (userId, date) => {
        const documentId = `${userId}-${date}`;
        const document = await findOrCreateDocument(documentId, userId, date);
        console.log("Socket event received:", documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta) => {
          socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data) => {
          await saveDocument(documentId, data);
        });

        socket.on("delete-note", async () => {
          await deleteDocument(documentId);
        });

        socket.on("disconnect", async () => {
          const note = await findDocument(documentId);
          if (note && note.data.ops) {
            const noteData = note.data.ops[0].insert;
            if (noteData.length === 1 || isOnlyWhiteSpace(noteData)) {
              await deleteDocument(documentId);
            }
          }
        });
      });
    });

    server.listen(serverPort, () => {
      console.log(`Server started on port ${serverPort} in stage ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    client.close();
  }
}

async function findOrCreateDocument(documentId, userId, date) {
  try {
    const database = await connectToDatabase();
    const notes = database.collection("notes");
    let note = await notes.findOne({ documentId: documentId });
    if (note) {
      return note;
    } else {
      const emptyDelta = { ops: [] };
      const updateResult = await notes.findOneAndUpdate(
        { documentId: documentId, userId: userId, date: date },
        { $setOnInsert: { data: emptyDelta, lastUpdated: new Date() } },
        { upsert: true, returnDocument: "after" }
      );
      note = updateResult.value;
      return note;
    }
  } catch (error) {
    await client.close();
    console.log("error", error);
    throw error;
  }
}

async function findDocument(documentId) {
  try {
    const database = await connectToDatabase();
    const notes = database.collection("notes");
    const note = await notes.findOne({ documentId });
    if (note) {
      return note;
    } else {
      throw new Error("Note document not found");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function saveDocument(documentId, data) {
  const database = await connectToDatabase();
  const notes = database.collection("notes");
  await notes.findOneAndUpdate(
    { documentId: documentId },
    { $set: { data, lastUpdated: new Date() } }
  );
}

async function deleteDocument(documentId) {
  try {
    const database = await connectToDatabase();
    const notes = database.collection("notes");
    const note = await notes.findOne({ documentId: documentId });
    if (note) {
      await notes.deleteOne({ documentId: documentId });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function isOnlyWhiteSpace(note) {
  return /^\s*$/.test(note);
}

startServer();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
