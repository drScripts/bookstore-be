const { request, response } = require("express");
const {
  User,
  UserProfile,
  Transaction,
  TransactionItem,
} = require("../../models");
const { Model } = require("sequelize");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      include: [
        {
          as: "profile",
          model: UserProfile,
        },
        {
          as: "transaction",
          model: Transaction,
          where: { status: "approve" },
          required: false,
          include: {
            as: "transactionItems",
            model: TransactionItem,
            include: "book",
          },
        },
      ],
    });

    res.send({
      status: "success",
      data: { user },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
