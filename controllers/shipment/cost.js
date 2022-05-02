const { request, response } = require("express");
const axios = require("axios").default;
const { rajaOngkirKey, rajaOngkirBaseRegion } = require("../../config");
const Joi = require("joi");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      dest: Joi.number().required().messages({
        "string.base": "destination must be a related city id",
        "any.required": "Please insert your destination city",
      }),
      courier: Joi.string().valid("jne", "pos", "tiki").required().messages({
        "string.base": "Courier must be a type of string",
        "any.only": "Please insert courier name either jne, pos, or tiki",
      }),
      weight: Joi.number().messages({
        "number.base": "Product weight must be a type of number",
      }),
    });

    const validation = scheme.validate(req.query);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error?.details[0]?.message,
      });

    const { dest, courier, weight = 1000 } = req.query;

    const dataBody = {
      origin: rajaOngkirBaseRegion,
      destination: dest,
      weight,
      courier,
    };

    const { data } = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      dataBody,
      {
        headers: {
          key: rajaOngkirKey,
        },
      }
    );

    const cost = data?.rajaongkir?.results;

    res.send({
      status: "success",
      data: { cost },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
