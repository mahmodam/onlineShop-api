const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const products = require("../data/products");

dotenv.config({ path: "./config/config.env" });

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Data Import Success");

    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

importData();
