const { Chat } = require("../models");
const { Op } = require("sequelize");
(async () => {
  const recipientId = 1;
  const user = { id: 2 };

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

  console.log(messages);

  process.exit(0);
})();
