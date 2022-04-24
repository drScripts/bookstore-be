const { request, response } = require("express");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = (req, res) => {
  try {
    const { title, publicationDate, pages, ISBN, author, price, description } =
      req.body;

    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
