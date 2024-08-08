const express = require("express");

const {
  addProductToWishlist,
  rmProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

const wishlistValidator = require("../utils/validators/wishlist.validator");

const AuthorizedService = require("../services/authService");

const router = express.Router();

router.use(AuthorizedService.authProtect, AuthorizedService.allowedTo("user"));

router.get("/", getLoggedUserWishlist);

router.post(
  "/:productId",
  ...wishlistValidator.addProductsToWishlistValidator,
  addProductToWishlist
);

router.delete(
  "/:productId",
  ...wishlistValidator.rmProductsFromWishlistValidator,
  rmProductFromWishlist
);

module.exports = { router };
