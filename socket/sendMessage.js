const { Chat } = require("../models");

module.exports = async (
  socket,
  io,
  user,
  recipientId,
  message,
  connectedUser
) => {
  try {
    const chat = Chat.create({
      recipientId,
      senderId: user?.id,
      message,
    });

    io.to(socket.id),
      to(connectedUser[recipientId]).emit("new message", recipientId);
  } catch (err) {
    throw new Error("can't process while sending messages!");
  }
};
