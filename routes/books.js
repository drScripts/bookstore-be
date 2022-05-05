const router = require("express").Router();
const {
  add,
  update,
  show,
  list,
  deleteData,
  listAdmin,
} = require("../controllers/books");
const { uploadFiles } = require("../middleware/uploadFiles");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");

router.get("/books", list);
router.get("/book/:id", show);

router.post("/book", [authMiddleware, adminMiddleware, uploadFiles(true)], add);
router.patch(
  "/book/:id",
  [authMiddleware, adminMiddleware, uploadFiles(false)],
  update
);
router.delete("/book/:id", [authMiddleware, adminMiddleware], deleteData);
router.get("/books/admin", [authMiddleware, adminMiddleware], listAdmin);

module.exports = router;
