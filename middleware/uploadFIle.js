const multer = require("multer");
const path = require("path");
const fs = require("fs");

module.exports = (fieldName, require = true) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(__dirname, `../public/${fieldName}`);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.fieldname !== fieldName) {
      req.validationFileError = {
        message: "Please upload the valid image file",
      };

      return cb(new Error("Please upload the valid image file", false));
    }

    return cb(null, true);
  };

  multer({
    storage: storage,
    fileFilter,
  });
};
