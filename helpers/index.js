const fs = require("fs");
const path = require("path");
const { baseUrl, jwtSecret } = require("../config");
const { sign } = require("jsonwebtoken");

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

const getJwtUser = (user) => {
  const userData = user.dataValues;
  const profile = user?.profile?.dataValues;

  userData.profile = profile;

  return sign(userData, jwtSecret);
};

module.exports = {
  deleteFileByPath,
  getFileUrl,
  deleteFile,
  getJwtUser,
};
