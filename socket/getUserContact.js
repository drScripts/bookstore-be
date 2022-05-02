const { Socket } = require("socket.io");
const { Chat, User } = require("../models");

/**
 *
 * @param {Socket} socket
 */
module.exports = async (socket, admin) => {
  try {
    const chats = await Chat.findAll({
      where: { recipientId: admin.id },
      include: {
        as: "sender",
        model: User,
        foreignKey: "senderId",
      },
      order: [["createdAt", "ASC"]],
    });

    const contact = {};

    chats.forEach((chat) => {
      contact[chat.senderId] = chat;
    });

    const contacts = [];

    for (const key in contact) {
      contacts.push(contact[key]);
    }

    socket.emit("user contact loaded", contacts);
  } catch (err) {
    throw new Error("Can't load user contact");
  }
};
