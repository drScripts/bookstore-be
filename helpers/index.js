const fs = require("fs");
const path = require("path");
const { baseUrl } = require("../config");

const deleteFileByPath = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getFileUrl = (filename, fileFolder) => {
  return `${baseUrl}/upload/${fileFolder}/${filename}`;
};

const deleteFile = (filename, fileFolder) => {
  const filePath = path.join(
    __dirname,
    `../public/upload/${fileFolder}/${filename}`
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  deleteFileByPath,
  getFileUrl,
  deleteFile,
};
