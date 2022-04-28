"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  UserProfile.init(
    {
      male: {
        type: DataTypes.ENUM,
        values: ["male", "female"],
        allowNull: true,
      },
      phoneNumber: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      profilePict: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          key: "id",
          model: {
            tableName: "users",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "user_profiles",
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
