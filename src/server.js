const app = require(".");
const connectDb = require("./connectDb/db");

// const PORT = process.env.PORT || 5456;
const PORT = 5456;

app.listen(PORT, async () => {
  await connectDb();
  console.log(`E-Commerce Server is running on port ${PORT}`);
});
