const { request, response } = require("express");
const { User, UserProfile } = require("../../models");
const Joi = require("joi");
const { getFileUrl, deleteFile } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 */
module.exports = async (req, res) => {
  try {
    const scheme = Joi.object({
      gender: Joi.string().valid("male", "female").messages({
        "string.base": "Gender must be a type of stirng",
        "any.only": "User gender value must be either male of female",
      }),
      phoneNumber: Joi.string().messages({
        "string.base": "User Phone number must be a type of string",
      }),
      address: Joi.string().messages({
        "string.base": "User Address must be a type of string",
      }),
      name: Joi.string().messages({
        "string.base": "User name must be a type of string",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { id } = req.user;
    const { gender, phoneNumber, address, name } = req.body;

    const prevUser = await User.findByPk(id, {
      include: "profile",
    });

    const profileUpdate = { gender, phoneNumber, address };
    const userUpdate = { name };

    console.log(req.file);
    if (req.file) {
      deleteFile(prevUser?.profile?.profilePict, "profile");
      profileUpdate.profilePict = req.file.filename;
    }

    await UserProfile.update(profileUpdate, {
      where: { id },
    });

    await prevUser.update(userUpdate);

    const user = await User.findByPk(id, {
      include: "profile",
      attributes: {
        exclude: ["password"],
      },
    });

    user.profile.profilePict = getFileUrl(
      user?.profile?.profilePict,
      "profile"
    );

    res.status(201).json({
      status: "created",
      data: { user },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
