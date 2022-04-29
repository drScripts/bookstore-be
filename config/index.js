require("dotenv").config();

module.exports = {
  baseUrl: process.env.APP_BASE_URL,
  jwtSecret: process.env.APP_JWT_SECRET,
  dbUser: process.env.DATABASE_USER,
  dbPass: process.env.DATABASE_PASS,
  dbName: process.env.DATABASE_NAME,
  dbHost: process.env.DATABASE_HOST,
  dbDialect: process.env.DATABASE_DIALECT,
  allowedClientOrigin: process.env.ALLOWED_CLIENT_ORIGIN,
  maxFileSize: parseInt(process.env.APP_ALLOWED_FILE_SIZE) || 2,
  midtransServerKey: process.env.MIDTRANS_SERVER_KEY,
  midtransIsProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
};
