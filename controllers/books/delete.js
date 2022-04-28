const { request, response } = require("express");
const { Book } = require("../../models");
const { deleteFile } = require("../../helpers");

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
        status: "error",
        message: "Can't find book with that id",
      });

    deleteFile(book?.bookAttachment, "pdf");
    deleteFile(book?.thumbnail, "image");

    await book.destroy();

    res.status(201).json({
      status: "created",
      message: "Book successfully deleted!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
