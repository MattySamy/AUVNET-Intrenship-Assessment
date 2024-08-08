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

// No need to populate subcategories
// categorySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "subcategories",
//     populate: {
//       path: "subSubcategories",
//     },
//   });
//   next();
// });

module.exports = mongoose.model("Category", categorySchema);
