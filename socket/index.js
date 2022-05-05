const { Server } = require("socket.io");
const { verify } = require("jsonwebtoken");
const loadAdminContact = require("./getAdminContact");
const loadUserContact = require("./getUserContact");
const loadMessage = require("./loadMessage");
const sendMessage = require("./sendMessage");
const { jwtSecret } = require("../config");

const connectedUser = [];

/**
 *
 * @param {Server} io
 */
module.exports = (io) => {
  io.use((socket, next) => {
    if (socket?.handshake?.auth && socket?.handshake?.auth?.token) {
      next();
    } else {
      throw new Error("Can't create handshake to server");
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected : ${socket.id}`);

    const token = socket.handshake.auth.token;

    const user = verify(token, jwtSecret);

    if (!user) throw new Error("can't validate handshake");

    connectedUser[user?.id] = socket.id;

    socket.broadcast.emit("user connected update", connectedUser);

    socket.on("load admin contact", () => {
      loadAdminContact(socket);
    });

    socket.on("get connected user", () => {
      socket.emit("user connected update", connectedUser);
    });

    socket.on("load user contact", () => {
      loadUserContact(socket, user);
    });
    socket.on("load message", (recipientId) => {
      loadMessage(socket, recipientId, user);
    });
    socket.on("send message", async (recipientId, message) => {
      await sendMessage(user, recipientId, message);

      io.to(socket.id)
        .to(connectedUser[recipientId])
        .emit("new message", recipientId);
    });

    socket.on("disconnect", () => {
      console.log(`User diconnected ${socket.id}`);
      delete connectedUser[user?.id];
      socket.broadcast.emit("user connected update", connectedUser);
    });
  });
};
