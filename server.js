const app = require("./app");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

dotenv.config({ path: "./config/config.env" });

connectDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
