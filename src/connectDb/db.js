const mongoose = require("mongoose");
MONGO_URL="mongodb://0.0.0.0:27017/eCommerce_Backend"

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
