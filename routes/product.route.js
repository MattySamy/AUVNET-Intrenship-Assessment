const express = require("express");
const productValidator = require("../utils/validators/product.validator");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

/* 
    Users are they like Guests or just Registered Users.

    From Your Requirements, I'll treat them as Registered Users.
*/

router.use(AuthorizedService.authProtect);

router
  .route("/")
  .post(
    AuthorizedService.allowedTo("user"),
    ...productValidator.createProductValidator,
    createProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .put(
    AuthorizedService.allowedTo("user"),
    ...productValidator.updateProductValidator,
    updateProduct
  )
  .get(...productValidator.getProductValidator, getProduct)
  .delete(...productValidator.deleteProductValidator, deleteProduct);

module.exports = { router };

// then mount this router in server.js
