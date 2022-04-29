const { request, response } = require("express");
const { Cart } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const cart = await Cart.findOne({ id, userId });

    if (!cart)
      res.status(404).json({
        status: "error",
        message: "can't find Cart item with that id",
      });

    await cart.destroy();

    res.status(201).json({
      status: "created",
      message: "Successfully delete cart item!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
