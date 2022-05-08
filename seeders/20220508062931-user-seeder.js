"use strict";
const { QueryInterface, Sequelize } = require("sequelize");
const { hashSync } = require("bcrypt");

module.exports = {
  /**
   *
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
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
      "users",
      [
        {
          name: "Admin",
          email: "admin@gmail.com",
          password: hashSync("admin@123", 10),
          role: "admin",
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
  },
};
