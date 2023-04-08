const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/errors");

const products = require("./routes/product");
const users = require("./routes/user");
const order = require("./routes/order");

app.use(express.json());

app.use(cookieParser());

app.use("/api", products);
app.use("/api", users);
app.use("/api", order);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
