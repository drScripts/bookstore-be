const router = require("express").Router();
const { province, cities, cost } = require("../controllers/shipment");

router.get("/shipment/province", province);
router.get("/shipment/cities", cities);
router.get("/shipment/cost", cost);

module.exports = router;
