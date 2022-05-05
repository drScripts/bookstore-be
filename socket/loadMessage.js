const { Chat } = require("../models");
const { Op } = require("sequelize");

module.exports = async (socket, recipientId, user) => {
  try {
    const messages = await Chat.findAll({
      where: {
        recipientId: {
          [Op.or]: [recipientId, user?.id],
        },
        senderId: {
          [Op.or]: [recipientId, user?.id],
        },
      },
      order: [["createdAt", "ASC"]],
    });

    socket.emit("message loaded", messages);
  } catch (err) {
    console.log(err);
    throw new Error("can't load messages");
  }
};
