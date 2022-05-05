const { request, response } = require("express");
const { Axios } = require("axios");
const { rajaOngkirKey } = require("../../config");

const axios = new Axios({
  baseURL: "https://indonesia-location.herokuapp.com/cities",
});

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { province } = req.query;
    const { data } = await axios.get("/", { params: { province } });

    const cities = JSON.parse(data)?.data?.cities;

    res.send({
      status: "success",
      data: { cities },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
