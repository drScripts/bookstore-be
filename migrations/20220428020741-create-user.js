"use strict";
const { QueryInterface, DataTypes } = require("sequelize");

module.exports = {
  /**
   *
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM,
        values: ["admin", "user"],
        defaultValue: "user",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });

    await queryInterface.addConstraint("users", {
      fields: ["email"],
      type: "unique",
      name: "UNIQUE_USER_EMAIL",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
