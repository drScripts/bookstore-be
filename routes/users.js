const router = require("express").Router();
const { create, login } = require("../controllers/users");

router.post("/register", create);
router.post("/login", login);

module.exports = router;
