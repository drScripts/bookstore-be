"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const transactionlog = require("./transactionlog");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });

      Transaction.hasMany(models.TransactionItem, {
        as: "transactionLogs",
        foreignKey: "idTransaction",
      });

      Transaction.hasMany(models.TransactionItem, {
        as: "transactionItems",
        foreignKey: "idTransaction",
      });
    }
  }
  Transaction.init(
    {
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["pending", "approve", "cancel"],
        defaultValue: "pending",
      },
      total: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      paymentType: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      paymentUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      paymentToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rawBody: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "transactions",
      modelName: "Transaction",
    }
  );
  return Transaction;
};
