"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "chats",
      [
        {
          senderId: 1,
          recipientId: 2,
          message: "Hello",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: 1,
          recipientId: 2,
          message: "Hai",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: 3,
          recipientId: 2,
          message: "Hai Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          senderId: 3,
          recipientId: 2,
          message: "Admin Test",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("chats", null, {});
  },
};
