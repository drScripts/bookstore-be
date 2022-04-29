const router = require("express").Router();
const { add, get, deleteData, update } = require("../controllers/cart");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);
router.post("/cart", add);
router.get("/carts", get);
router.delete("/cart/:id", deleteData);
router.patch("/cart/:id", update);

module.exports = router;
