const { request, response } = require("express");
const { Cart, Book } = require("../../models");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      qty: Joi.number().messages({
        "number.base": "Quantity of cart must be a type of number",
      }),
      type: Joi.string()
        .valid("DECREMENT", "INCREMENT", "UPDATE")
        .required()
        .messages({
          "string.base": "Type must be a type of string",
          "any.only":
            "Type value must be either Decrement, Increment, or Update",
          "any.required": "Please insert update type",
        }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { id } = req.params;
    const { id: userId } = req.user;
    const { type, qty } = req.body;

    const cart = await Cart.findOne({
      where: { id, userId },
      include: {
        as: "book",
        model: Book,
        attributes: {
          exclude: ["bookAttachment"],
        },
      },
    });

    if (!cart)
      return res.status(404).json({
        status: "error",
        message: "Can't find cart item",
      });

    switch (type) {
      case "DECREMENT":
        await cart.update({ qty: cart.qty - 1 });
        break;
      case "INCREMENT":
        await cart.update({ qty: cart.qty + 1 });
        break;
      default:
        await cart.update({ qty });
        break;
    }

    res.status(201).json({
      status: "created",
      data: { cart },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
