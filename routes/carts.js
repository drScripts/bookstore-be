const router = require("express").Router();
const { add, get, deleteData, update } = require("../controllers/cart");
const authMiddleware = require("../middleware/auth");

router.post("/cart", authMiddleware, add);
router.get("/carts", authMiddleware, get);
router.delete("/cart/:id", authMiddleware, deleteData);
router.patch("/cart/:id", authMiddleware, update);

module.exports = router;
