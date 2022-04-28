const router = require("express").Router();
const { add, update, get } = require("../controllers/promo-books");

router.get("/promo-books", get);
router.post("/promo-book", add);
router.patch("/promo-book", update);

module.exports = router;
