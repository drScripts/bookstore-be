const { request, response } = require("express");
const { User, UserProfile } = require("../../models");
const Joi = require("joi");
const {
  getFileUrl,
  deleteFile,
  deleteCloudFile,
  cloudStoreFile,
} = require("../../helpers");

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
      provinceId: Joi.number().messages({
        "number.base": "Province id must be a type of number",
      }),
      regionId: Joi.number().messages({
        "region.base": "Region id must be a type of number",
      }),
    });

    const validation = scheme.validate(req.body);

    if (validation.error)
      return res.status(400).json({
        status: "error",
        message: validation.error.details[0].message,
      });

    const { id } = req.user;
    const { gender, phoneNumber, address, name, provinceId, regionId } =
      req.body;

    const prevUser = await User.findByPk(id, {
      include: "profile",
    });

    const profileUpdate = {
      gender,
      phoneNumber,
      address,
      provinceId,
      regionId,
    };
    const userUpdate = { name };

    if (req.file) {
      if (process.env.NODE_ENV === "production") {
        if (prevUser?.profile?.profilePict) {
          if (prevUser?.profile?.profilePict?.search("http") !== -1) {
            deleteCloudFile(prevUser?.profile?.profilePict);
          }
        }

        const { secure_url } = await cloudStoreFile(
          req.file,
          "ways_book_profile"
        );

        profileUpdate.profilePict = secure_url;
      } else {
        deleteFile(prevUser?.profile?.profilePict, "profile");
        profileUpdate.profilePict = req.file.filename;
      }
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
