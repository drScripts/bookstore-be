const router = require("express").Router();
const { create, login, update } = require("../controllers/users");
const authMiddleware = require("../middleware/auth");
const uploadFile = require("../middleware/uploadFIle");

router.post("/register", create);
router.post("/login", login);
router.patch(
  "/profile",
  [authMiddleware, uploadFile("profile", false)],
  update
);

module.exports = router;
