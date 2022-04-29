const router = require("express").Router();
const { create, webhook, get } = require("../controllers/transaction");
const authMiddleware = require("../middleware/auth");

router.post("/transaction/notification", webhook);

router.use(authMiddleware);
router.post("/transaction", create);
router.get("/transactions", get);

module.exports = router;
