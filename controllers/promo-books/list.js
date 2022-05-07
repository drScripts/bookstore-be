const { request, response } = require("express");
const { PromoBook, Book } = require("../../models");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const promo = await PromoBook.findAll({
      include: {
        model: Book,
        as: "book",
      },
      order: [["createdAt", "DESC"]],
    });

    const promoBooks = promo.map((promo) => {
      promo.book.thumbnail = getFileUrl(promo?.book?.thumbnail, "image");
      promo.book.bookAttachment = getFileUrl(
        promo?.book?.bookAttachment,
        "pdf"
      );
      return promo;
    });

    res.status(200).json({
      status: "success",
      data: { promoBooks },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
