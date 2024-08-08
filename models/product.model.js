/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");

const User = require("./user.model");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [3, "Too short product title"],
      maxLength: [100, "Too long product title"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [20, "Too short product description"], // with string type
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [2000000, "Too long product price"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a specific category"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Product must belong to a specific user"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "-subcategories",
  });
  next();
});

productSchema.post("save", async function (doc, next) {
  try {
    if (doc.user)
      await User.findByIdAndUpdate(doc.user, { $push: { products: doc._id } });
    next();
  } catch (error) {
    next(error);
  }
});

productSchema.post("remove", async function (doc, next) {
  try {
    if (doc.user)
      await User.findByIdAndUpdate(doc.user, { $pull: { products: doc._id } });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
