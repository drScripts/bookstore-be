"use strict";
const { QueryInterface, DataTypes } = require("sequelize");

module.exports = {
  /**
   *
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_profiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      male: {
        type: Sequelize.ENUM,
        values: ["male", "female"],
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profilePict: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          key: "id",
          model: {
            tableName: "users",
          },
        },
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_profiles");
  },
};
