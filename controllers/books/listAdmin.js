const { request, response } = require("express");
const { Book } = require("../../models");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [["createdAt", "DESC"]],
    });

    const mappedBooks = books.map((book) => {
      book.bookAttachment = getFileUrl(book?.bookAttachment, "pdf");
      book.thumbnail = getFileUrl(book?.thumbnail, "image");

      return book;
    });

    res.status(200).json({
      status: "success",
      data: { books: mappedBooks },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
