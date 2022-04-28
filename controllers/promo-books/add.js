const { request, response } = require("express");
const Joi = require("joi");
const { Book, PromoBook } = require("../../models");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      idBooks: Joi.array().required().messages({
        "array.base": "Id Books must be a type of array",
        "any.required": "Please insert id books",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { idBooks } = req.body;

    const idBookMapped = idBooks.map((book, index) => ({ idBook: book }));

    await PromoBook.bulkCreate(idBookMapped);

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
