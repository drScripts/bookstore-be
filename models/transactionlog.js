"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionLog.belongsTo(models.Transaction, {
        as: "transaction",
        foreignKey: "idTransaction",
      });
    }
  }
  TransactionLog.init(
    {
      idTransaction: DataTypes.INTEGER,
      status: DataTypes.STRING,
      rawBody: DataTypes.JSON,
    },
    {
      sequelize,
      tableName: "transaction_logs",
      modelName: "TransactionLog",
    }
  );
  return TransactionLog;
};
