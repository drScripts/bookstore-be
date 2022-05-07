const { request, response } = require("express");
const Joi = require("joi");
const { deleteFileByPath, cloudStoreFile } = require("../../helpers");
const { Book } = require("../../models");
const moment = require("moment");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      title: Joi.string().required().messages({
        "string.base": "Title must be a type of string",
        "any.required": "Please insert book title",
      }),
      publicationDate: Joi.date().required().messages({
        "date.base": "Publication date must be a type of date",
        "any.required": "Please insert book publication date",
      }),
      pages: Joi.number().required().messages({
        "number.base": "Book pages must be a type of number",
        "any.required": "Please insert book pages",
      }),
      ISBN: Joi.number().required().messages({
        "number.base": "ISBN must be a type of number",
        "any.required": "Please insert book ISBN",
      }),
      author: Joi.string().required().messages({
        "string.base": "Author must be a type of string",
        "any.required": "Please insert book author",
      }),
      price: Joi.number().required().messages({
        "number.base": "Price must be a type of number",
        "any.required": "Please inser book price",
      }),
      description: Joi.string().messages({
        "string.base": "Description must be a type of string",
        "any.required": "Please insert book description",
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

    let pdfName = req?.files?.pdf[0]?.path?.split("\\")?.pop();
    let imgName = req?.files?.image[0]?.path?.split("\\")?.pop();

    if (process.env.NODE_ENV !== "production") {
      const pdf = await cloudStoreFile(req?.files?.pdf[0], "ways_book_pdf");
      const img = await cloudStoreFile(
        req?.files?.image[0],
        "ways_book_thumbnail"
      );
      pdfName = pdf.secure_url;
      imgName = img.secure_url;
    }

    const book = await Book.create({
      title,
      publicationDate: moment(publicationDate).format("YYYY-MM-DD"),
      pages,
      ISBN,
      author,
      description,
      price,
      bookAttachment: pdfName,
      thumbnail: imgName,
    });

    book.bookAttachment = getFileUrl(book?.bookAttachment, "pdf");
    book.thumbnail = getFileUrl(book?.thumbnail, "image");

    res.status(201).json({
      status: "created",
      data: {
        book,
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
