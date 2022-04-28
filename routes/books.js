const router = require("express").Router();
const { add, update, show, list, deleteData } = require("../controllers/books");
const { uploadFiles } = require("../middleware/uploadFiles");

router.get("/books", list);
router.post("/book", uploadFiles(true), add);
router.patch("/book/:id", uploadFiles(false), update);
router.get("/book/:id", show);
router.delete("/book/:id", deleteData);

module.exports = router;
