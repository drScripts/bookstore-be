const multer = require("multer");
const path = require("path");
const { maxFileSize } = require("../config");
const fs = require("fs");

/**
 *
 * @param {string} imageFile image file field in form / request body
 * @param {boolean} required is request should upload the image or not
 * @returns
 */
exports.uploadFiles = (required = true) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(
        __dirname,
        `../public/upload/${file.fieldname}`
      );

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      const obj = {};
      obj[file.fieldname] = folderPath;

      req.folderPath = {
        ...req.folderPath,
        ...obj,
      };

      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  // Filter file extension
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === "image") {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        req.fileValidationError = {
          message: "Please upload the valid image file",
        };
        return cb(new Error("Please upload the valid image file", false));
      }
    } else {
      if (!file.originalname.match(/\.(pdf)$/i)) {
        req.fileValidationError = {
          message: "Please upload the valid pdf file",
        };
        return cb(new Error("Please upload the valid pdf file", false));
      }
    }
    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize * 1000 * 1000,
    },
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]);

  return (req, res, next) => {
    upload(req, res, (err) => {
      // if filter error
      if (req.fileValidationError)
        return res.status(400).json({
          status: "error",
          message: req.fileValidationError.message,
        });

      if (required) {
        if (!req.files.image && !req.files.pdf && !err)
          return res.status(400).json({
            status: "error",
            message: "Please upload file image and pdf",
          });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE")
          return res.status(400).json({
            status: "error",
            message: `File ${err.field} max size is ${maxSizeMb} MB!`,
          });

        if (err.code === "LIMIT_UNEXPECTED_FILE")
          return res.status(400).json({
            status: "error",
            message: `File ${err.field} only 1 file you can upload`,
          });

        return res.status(400).json({
          stats: "error",
          message: err.message,
        });
      }

      next();
    });
  };
};
