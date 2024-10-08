const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wishList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password on create
  const salt = await bcrypt.hash(this.password, 12);
  this.password = salt;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "wishList",
  });
  next();
});

module.exports = mongoose.model("User", userSchema);
