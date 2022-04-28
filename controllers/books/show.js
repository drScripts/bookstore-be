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
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book)
      return res.status(404).json({
        status: "not found",
        message: "Can't find book with that id",
      });

    book.bookAttachment = getFileUrl(book.bookAttachment, "pdf");
    book.thumbnail = getFileUrl(book.thumbnail, "image");

    res.status(200).json({
      status: "success",
      data: { book },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
