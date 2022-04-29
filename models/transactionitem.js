"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionItem.belongsTo(models.Transaction, {
        as: "transaction",
        foreignKey: "idTransaction",
      });

      TransactionItem.belongsTo(models.Book, {
        as: "book",
        foreignKey: "idBook",
      });
    }
  }
  TransactionItem.init(
    {
      idTransaction: DataTypes.INTEGER,
      idBook: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "transaction_items",
      modelName: "TransactionItem",
    }
  );
  return TransactionItem;
};
