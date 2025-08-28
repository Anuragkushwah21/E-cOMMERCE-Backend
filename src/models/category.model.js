const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    require: true,
  },
  level: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;
