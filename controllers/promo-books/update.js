const { request, response } = require("express");
const { PromoBook, Book } = require("../../models");
const { getFileUrl } = require("../../helpers");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      idBooks: Joi.array().messages({
        "array.base": "id books must be a type of array",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { idBooks } = req.body;

    if (idBooks) {
      await PromoBook.destroy({ where: {}, truncate: true });

      const mappedBooks = idBooks.map((book, index) => ({ idBook: book }));
      await PromoBook.bulkCreate(mappedBooks);
    }

    const promoBooks = await PromoBook.findAll({
      include: {
        model: Book,
        as: "book",
      },
    });

    const mappedPromoBooks = promoBooks.map((promo, index) => {
      promo.book.bookAttachment = getFileUrl(
        promo?.book?.bookAttachment,
        "pdf"
      );
      promo.book.thumbnail = getFileUrl(promo?.book?.thumbnail, "image");

      return promo;
    });

    res.status(201).json({
      status: "created",
      data: { promoBooks: mappedPromoBooks },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
