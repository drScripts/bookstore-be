const { request, response } = require("express");
const Joi = require("joi");
const { Book, Cart } = require("../../models");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      bookId: Joi.number().required().messages({
        "number.base": "Book id must be a type of number",
        "any.required": "Please insert Book",
      }),
      qty: Joi.number().messages({
        "number.base": "Quantity must be a type of number",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { id: userId } = req.user;
    const { bookId } = req.body;

    const checkBook = await Book.findByPk(bookId);

    if (!checkBook)
      return res.status(400).json({
        status: "error",
        message: "can't find book with that id",
      });

    const checkCurrentcart = await Cart.findOne({
      where: {
        userId,
        bookId,
      },
    });

    if (checkCurrentcart) {
      await checkCurrentcart.update({ qty: checkCurrentcart.qty + 1 });
    } else {
      await Cart.create({
        userId,
        bookId,
      });
    }

    const usercarts = await Cart.findAll({
      where: { userId },
      include: {
        as: "book",
        model: Book,
        attributes: {
          exclude: ["bookAttachment"],
        },
      },
    });

    const mappedCarts = usercarts.map((cart) => {
      cart.book.thumbnail = getFileUrl(cart?.book?.thumbnail, "image");

      return cart;
    });

    res.status(201).json({
      status: "created",
      data: { carts: mappedCarts },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
