"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publicationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ISBN: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      author: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bookAttachment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "books",
    }
  );
  return Book;
};
