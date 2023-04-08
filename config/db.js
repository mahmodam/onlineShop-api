// const mongoose = require("mongoose");
// // npm i config

// const config = require("config/config.env");
// const db = config.get("mongoURI");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.mongoURI, {
//       useNewUrlParser: true,
//     });

//     console.log("MongoDB Connected...");
//   } catch (err) {
//     console.error(err.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);

    process.exit(1);
  }
};

module.exports = connectDB;
