const router = require("express").Router();
const { add } = require("../controllers/books");
const { uploadFiles } = require("../middleware/uploadFiles");

router.post("/book", uploadFiles("image", "files", true), add);

module.exports = router;
