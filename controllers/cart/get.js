const { request, response } = require("express");
const { Cart, Book } = require("../../models");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const carts = await Cart.findAll({
      where: { userId },
      include: {
        as: "book",
        model: Book,
        attributes: {
          exclude: ["bookAttachment"],
        },
      },
    });

    const mappedCarts = carts.map((cart) => {
      cart.book.thumbnail = getFileUrl(cart?.book?.thumbnail, "image");

      return cart;
    });

    res.status(200).json({
      status: "success",
      data: { carts: mappedCarts },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
