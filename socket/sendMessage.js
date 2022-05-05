const { Chat } = require("../models");

module.exports = async (user, recipientId, message) => {
  try {
    await Chat.create({
      recipientId,
      senderId: user?.id,
      message,
    });
  } catch (err) {
    console.log(err);
    throw new Error("can't process while sending messages!");
  }
};
