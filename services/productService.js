/* eslint-disable node/no-unsupported-features/es-syntax */
const ProductModel = require("../models/product.model");
const factory = require("./handlers.factory");

// @desc Get all products
// @route GET /api/v1/products
// @access Public

exports.getProducts = factory.getAll(ProductModel);

// @desc Get single product by id
// @route GET /api/v1/products/:id
// @access Public

exports.getProduct = factory.getOne(ProductModel);

// @desc Update specific product
// @route PUT /api/v1/products/:id
// @access Private(User)

exports.updateProduct = factory.updateOne(ProductModel);

// @desc Delete specific product
// @route DELETE /api/v1/products/:id
// @access Public

exports.deleteProduct = factory.deleteOne(ProductModel);

// @desc Create new product
// @route POST /api/v1/products
// @access Private(User)

exports.createProduct = factory.createOne(ProductModel);
