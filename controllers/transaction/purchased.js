const { request, response } = require("express");
const { getFileUrl } = require("../../helpers");
const { TransactionItem } = require("../../models");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { transactionId, bookId } = req.params;

    const book = await TransactionItem.findOne({
      where: { idTransaction: transactionId, idBook: bookId },
      include: ["book", "transaction"],
    });

    if (!book)
      return res.status(404).json({
        status: "Not found",
        message: "Can't find your purchased book",
      });

    book.book.thumbnail = getFileUrl(book?.book?.thumbnail, "image");
    book.book.bookAttachment = getFileUrl(book?.book?.bookAttachment, "pdf");

    if (book?.transaction?.status !== "approve") {
      delete book?.book?.bookAttachment;
    }

    res.send({
      status: "success",
      data: { book },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
