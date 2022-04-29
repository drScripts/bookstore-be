const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { maxFileSize } = require("../config");

module.exports = (fieldName, required = true) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(__dirname, `../public/upload/${fieldName}`);

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
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      req.fileValidationError = {
        message: "Please upload the valid image file",
      };
      return cb(new Error("Please upload the valid image file", false));
    }

    return cb(null, true);
  };

  const maxSize = maxFileSize * 1000 * 1000;

  const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
      fieldSize: maxSize,
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.validationFileError)
        return res.status(400).json({
          status: "error",
          message: req.validationFileError.message,
        });

      if (required) {
        if (!req.file && !err)
          return res.status(400).json({
            status: "error",
            message: "Please insert the image",
          });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            status: "error",
            message: `Maximum of allowed file size is ${maxFileSize}Mb`,
          });
        }

        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      }

      next();
    });
  };
};
