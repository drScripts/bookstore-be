const { request, response } = require("express");
const { Axios } = require("axios").default;
const { rajaOngkirKey } = require("../../config");

const axios = new Axios({
  baseURL: "https://api.rajaongkir.com/starter/province",
  headers: {
    key: rajaOngkirKey,
  },
});

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { data } = await axios.get("/");

    const province = JSON.parse(data)?.rajaongkir?.results;

    res.send({
      status: "success",
      data: { province },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
