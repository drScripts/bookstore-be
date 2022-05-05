const { request, response } = require("express");
const Joi = require("joi");
const { hashSync } = require("bcrypt");
const { User, UserProfile } = require("../../models");
const { getJwtUser, getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      name: Joi.string().required().messages({
        "string.base": "User name must be a type of string",
        "any.required": "Please insert your full name",
      }),
      email: Joi.string().email().required().messages({
        "string.base": "User email must be a type of string",
        "string.email": "Your email must be an active email",
        "any.required": "Please insert your email",
      }),
      password: Joi.string().min(8).required().messages({
        "string.base": "User password must be a type of string",
        "string.min":
          "Your password length must be greather equal than 8 character",
        "any.required": "Please insert your password",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error?.details[0]?.message,
      });

    const { email, name, password } = req.body;

    const hashedPass = hashSync(password, 10);

    const user = await User.create({ email, name, password: hashedPass });
    await UserProfile.create({ userId: user.id });

    const newUser = await User.findByPk(user.id, {
      include: {
        as: "profile",
        model: UserProfile,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    const token = getJwtUser(newUser);

    if (newUser?.profile?.profilePict) {
      newUser.profile.profilePict = getFileUrl(
        newUser?.profile?.profilePict,
        "profile"
      );
    }

    res.status(201).json({
      status: "created",
      data: {
        user: newUser,
        token,
        tokenType: "Bearer",
      },
    });
  } catch (err) {
    console.log(err);

    if (err?.errors) {
      if (err?.errors[0]?.path === "UNIQUE_USER_EMAIL")
        return res.status(400).json({
          status: "error",
          message: "Email already registered! Please login !",
        });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
