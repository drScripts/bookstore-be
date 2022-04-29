const { request, response } = require("express");
const Joi = require("joi");
const { Cart, TransactionItem, Transaction, Book } = require("../../models");
const { buildSnapBody, createSnap } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      shipmentCost: Joi.number().required().messages({
        "number.base": "shipment cost Must be a type of number",
        "any.required": "Please inser shipment cost",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { id: userId } = req.user;
    const { shipmentCost } = req.body;

    let totalPayment = shipmentCost;

    const carts = await Cart.findAll({ where: { userId }, include: "book" });

    const mappedcarts = carts.map((cart) => {
      totalPayment += cart?.qty * cart?.book?.price;

      return { idBook: cart?.book?.id, qty: cart.qty };
    });

    const transaction = await Transaction.create({
      total: totalPayment,
      userId,
    });

    const transactionItems = mappedcarts.map((cart) => {
      cart.idTransaction = transaction.id;
      return cart;
    });

    await TransactionItem.bulkCreate(transactionItems);

    const getTransaction = await Transaction.findByPk(transaction.id, {
      include: {
        as: "transactionItems",
        model: TransactionItem,
        include: {
          as: "book",
          model: Book,
          attributes: {
            exclude: ["bookAttachment"],
          },
        },
      },
    });

    const snapBody = buildSnapBody(shipmentCost, getTransaction, req.user);

    const snap = await createSnap(snapBody);

    const newTransaction = await transaction.update({
      paymentUrl: snap?.redirect_url,
      paymentToken: snap?.token,
      rawBody: snapBody,
    });

    await Cart.destroy({ where: { userId } });

    res.status(201).json({
      status: "creaated",
      data: { transaction: newTransaction },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
