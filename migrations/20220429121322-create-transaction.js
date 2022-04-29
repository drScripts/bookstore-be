"use strict";
const { DataTypes, QueryInterface } = require("sequelize");

module.exports = {
  /**
   *
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: "pending",
        values: ["pending", "cancel", "approve"],
      },
      total: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      paymentToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: {
            tableName: "users",
          },
        },
        onDelete: "CASCADE",
      },
      rawBody: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transactions");
  },
};
