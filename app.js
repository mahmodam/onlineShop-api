const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/errors");

const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

const products = require("./routes/product");
const users = require("./routes/user");
const order = require("./routes/order");
const payment = require("./routes/payment");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(fileUpload());

app.use(cors());

// Set up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api", products);
app.use("/api", users);
app.use("/api", payment);
app.use("/api", order);

// run backend and frontend on same port
// after run npm run build in client folder
// if (process.env.NODE_ENV === "PRODUCTION") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
//   });
// }

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
