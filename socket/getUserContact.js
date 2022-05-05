const { Socket } = require("socket.io");
const { getFileUrl } = require("../helpers");
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
        include: "profile",
        attributes: {
          exclude: ["password"],
        },
      },
      order: [["createdAt", "ASC"]],
    });

    const contact = {};

    chats.forEach((chat) => {
      if (chat?.sender?.profile?.profilePict) {
        chat.sender.profile.profilePict = getFileUrl(
          chat?.sender?.profile?.profilePict,
          "profile"
        );
      }
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
