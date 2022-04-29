const { verify } = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { request, response } = require("express");

/**
 *
 * @param {request} req
 * @param {response} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({
      status: "error",
      message: "Unauthorized user",
    });

  const token = req.headers.authorization.split("Bearer ").pop();

  let user;
  try {
    user = verify(token, jwtSecret);
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
  }

  if (!user)
    return res.status(401).json({
      status: "error",
      message: "Unauthorized user",
    });

  req.user = user;

  next();
};
