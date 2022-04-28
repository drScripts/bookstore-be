const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const booksRouter = require("./routes/books");
const promoBooksRouter = require("./routes/promo-books");
const usersRouter = require("./routes/users");

const app = express();
const prefix = "/api/v1";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(prefix, booksRouter);
app.use(prefix, promoBooksRouter);
app.use(prefix, usersRouter);

module.exports = app;
