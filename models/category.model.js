const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  type: String,
  subcategories: [
    // Levels of subcategories
    new mongoose.Schema({
      name: String,
      subSubcategories: [
        new mongoose.Schema({
          name: String,
        }),
      ],
    }),
  ],
});

module.exports = mongoose.model("Category", categorySchema);
