"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class PromoBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PromoBook.belongsTo(models.Book, {
        as: "book",
        foreignKey: "idBook",
        onDelete: "CASCADE",
      });
    }
  }
  PromoBook.init(
    {
      idBook: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "promo_books",
      modelName: "PromoBook",
    }
  );
  return PromoBook;
};
