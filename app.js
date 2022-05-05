const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const booksRouter = require("./routes/books");
const promoBooksRouter = require("./routes/promo-books");
const usersRouter = require("./routes/users");
const cartRouter = require("./routes/carts");
const transactionRouter = require("./routes/transaction");
const shipmentRouter = require("./routes/shipment");

const app = express();
const prefix = "/api/v1";

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(prefix, booksRouter);
app.use(prefix, promoBooksRouter);
app.use(prefix, usersRouter);
app.use(prefix, cartRouter);
app.use(prefix, transactionRouter);
app.use(prefix, shipmentRouter);

module.exports = app;
