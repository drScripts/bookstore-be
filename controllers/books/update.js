const { request, response } = require("express");
const { Book } = require("../../models");
const Joi = require("joi");
const { deleteFile, getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = Joi.object({
      title: Joi.string().messages({
        "string.base": "Title must be a type of string",
      }),
      publicationDate: Joi.date().messages({
        "date.base": "Publication date must be a type of date",
      }),
      pages: Joi.number().messages({
        "number.base": "Book pages must be a type of number",
      }),
      ISBN: Joi.number().messages({
        "number.base": "ISBN must be a type of number",
      }),
      author: Joi.string().messages({
        "string.base": "Author must be a type of string",
      }),
      price: Joi.number().messages({
        "number.base": "Price must be a type of number",
      }),
      description: Joi.string().messages({
        "string.base": "Description must be a type of string",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error) {
      for (const fileField in req?.files) {
        deleteFileByPath(req?.files[fileField][0]?.path);
      }

      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });
    }

    const { title, publicationDate, pages, ISBN, author, price, description } =
      req.body;

    const bodyDataUpdate = {
      title,
      publicationDate,
      pages,
      ISBN,
      author,
      price,
      description,
    };

    const book = await Book.findByPk(id);

    if (!book)
      return res.status(404).json({
        status: "not found",
        message: "Can't find book with that id",
      });

    if (req.files) {
      if (req.files?.pdf) {
        deleteFile(book?.bookAttachment, "pdf");
        const name = req?.files?.pdf[0]?.path?.split("\\").pop();
        bodyDataUpdate.bookAttachment = name;
      }

      if (req.files?.image) {
        deleteFile(book?.thumbnail, "image");
        const name = req?.files?.image[0]?.path?.split("\\").pop();
        bodyDataUpdate.thumbnail = name;
      }
    }

    await book.update(bodyDataUpdate);
    const newBook = await Book.findByPk(id);

    newBook.bookAttachment = getFileUrl(newBook.bookAttachment, "pdf");
    newBook.thumbnail = getFileUrl(newBook.thumbnail, "image");

    res.status(201).json({
      message: "created",
      data: {
        book: newBook,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
