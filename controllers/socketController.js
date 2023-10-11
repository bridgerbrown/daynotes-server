const Note = require('../models/Note');
const server = require('../index');
const mongoose = require('mongoose');

function initializeSocketHandler(io) {
  io.on("connection", (socket) => {
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

  async function findOrCreateDocument(documentId, userId, date) {
    try {
      const note = await Note.findOne({ documentId: documentId });
      if (note) {
        return note;
      } else {
        const emptyDelta = { ops: [] };
        const newNote = new Note({
          documentId,
          userId,
          date,
          data: emptyDelta,
          lastUpdated: new Date(),
        });
        await newNote.save();
        return newNote;
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async function findDocument(documentId) {
    try {
      return Note.findOne({ documentId });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function saveDocument(documentId, data) {
    try {
      const note = await findDocument(documentId);
      note.data = data;
      note.lastUpdated = new Date();
      await note.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function deleteDocument(documentId) {
    try {
      await Note.deleteOne({ documentId });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  function isOnlyWhiteSpace(note) {
    return /^\s*$/.test(note);
  }
}

module.exports = initializeSocketHandler;
