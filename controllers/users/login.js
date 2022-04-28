const { request, response } = require("express");
const { User } = require("../../models");
const Joi = require("joi");
const { compareSync } = require("bcrypt");
const { getJwtUser } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      email: Joi.string().email().required().messages({
        "string.base": "User email must be a type of string",
        "string.email": "Your email must be an active email",
        "any.required": "Please insert your email",
      }),
      password: Joi.string().required().messages({
        "string.base": "User password must be a type of string",
        "any.required": "Please insert your password!",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error?.details[0].message,
      });

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, include: "profile" });

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "Can't find user with that email",
      });

    if (!compareSync(password, user.password))
      return res.status(400).json({
        status: "error",
        message: "Wrong password!",
      });

    delete user.dataValues.password;

    const token = getJwtUser(user);

    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
        tokenType: "Bearer",
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).status({
      status: "error",
      message: "Internal server error",
    });
  }
};
