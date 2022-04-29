const fs = require("fs");
const path = require("path");
const {
  baseUrl,
  jwtSecret,
  midtransIsProduction,
  midtransServerKey,
} = require("../config");
const { sign } = require("jsonwebtoken");
const { Snap } = require("midtrans-client");

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

  console.log(filePath);

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

const createSnap = async (body) => {
  const snap = new Snap({
    isProduction: midtransIsProduction,
    serverKey: midtransServerKey,
  });

  const snapTransaction = await snap.createTransaction(body);
  return snapTransaction;
};

const buildSnapBody = (shipmentCost, transaction, user) => {
  const data = {};

  let r = (Math.random() + 1).toString(36).substring(5);

  data.transaction_details = {
    order_id: transaction?.id + `-${r}`,
    gross_amount: transaction?.total,
  };

  const dataItem = transaction?.transactionItems?.map((item) => {
    const detailItem = {
      id: item?.book?.id,
      price: item?.book?.price,
      quantity: item?.qty,
      name: item?.book?.title,
    };
    return detailItem;
  });

  dataItem.push({
    id: "#shipping",
    price: shipmentCost,
    quantity: 1,
    name: "Item Shipping",
  });

  data.item_details = dataItem;

  data.customer_details = {
    first_name: user?.name,
    email: user?.email,
    phone: user?.profile?.phoneNumber,
  };

  return data;
};

module.exports = {
  deleteFileByPath,
  getFileUrl,
  deleteFile,
  getJwtUser,
  buildSnapBody,
  createSnap,
};
