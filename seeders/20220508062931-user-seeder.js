"use strict";
const { QueryInterface, Sequelize } = require("sequelize");
const { hash } = require("bcrypt");

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
          password: hash("admin@123", 10),
          role: "admin",
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      "user_profiles",
      [
        {
          gender: "male",
          phoneNumber: "0123123123",
          address: "Komplek permata kopo blok ca no 15",
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
