const { request, response } = require("express");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = (req, res, next) => {
  if (!req?.user && req?.user?.role !== "admin")
    return res.status(401).json({
      status: "error",
      message: "Restricted area",
    });

  next();
};
