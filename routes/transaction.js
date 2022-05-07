const router = require("express").Router();
const {
  create,
  webhook,
  get,
  list,
  purchased,
  show,
  finish,
} = require("../controllers/transaction");
const authMiddleware = require("../middleware/auth");

router.post("/transaction/notification", webhook);
router.post("/transaction/finish", finish);

router.post("/transaction", authMiddleware, create);
router.get("/transactions", authMiddleware, list);
router.get("/transactions/all", authMiddleware, get);
router.get("/transaction/:id", authMiddleware, show);
router.get(
  "/transaction/:transactionId/book/:bookId",
  authMiddleware,
  purchased
);

module.exports = router;
