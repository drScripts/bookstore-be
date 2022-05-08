const { request, response } = require("express");
const { Book } = require("../../models");
const { getFileUrl } = require("../../helpers");
const { Op } = require("sequelize");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const whereQuery = {};

    const { q } = req.query;

    if (q && q !== "null") {
      if (process.env.NODE_ENV === "production") {
        whereQuery.title = {
          [Op.iLike]: `%${q}%`,
        };
        whereQuery.description = {
          [Op.iLike]: `%${q}%`,
        };
        whereQuery.author = {
          [Op.iLike]: `%${q}%`,
        };
      } else {
        whereQuery.title = {
          [Op.like]: `%${q}%`,
        };
        whereQuery.description = {
          [Op.like]: `%${q}%`,
        };
        whereQuery.author = {
          [Op.like]: `%${q}%`,
        };
      }
    }

    const books = await Book.findAll({
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["bookAttachment"],
      },
      where: {
        [Op.or]: whereQuery,
      },
    });

    const mappedBooks = books.map((book) => {
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
