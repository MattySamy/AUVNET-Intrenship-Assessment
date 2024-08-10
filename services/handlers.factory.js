const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/errorHandler");
const ApiPagination = require("../utils/apiPagination");
const Category = require("../models/category.model");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    //
    if (Model.modelName === "Product") {
      const categories = await Category.find().select("_id"); // Fetch all categories and select only the _id field
      const categoryIds = categories.map((category) => category._id.toString()); // Extract the _id values as strings

      const products = await Model.find(); // Fetch all products

      for (const product of products) {
        if (
          !product.category ||
          !categoryIds.includes(product.category._id.toString())
        ) {
          // If the category is null or does not exist in the category list
          await Model.deleteOne({ _id: product._id }); // Delete the product
          console.log(
            `Deleted product with _id: ${product._id} and category: ${product.category}`
          );
        }
      }
    }
    const { id } = req.params;
    let model = await Model.findById(id);
    if (!model) {
      return next(
        new ApiError(`${Model.modelName} not found for id: ${id}`, 404)
      );
    }

    // Trigger "remove" event launched by mongoose middleware (deprecated for mongoose@6)
    await model.deleteOne();

    res.status(200).json({
      status: "success",
      msg: `${Model.modelName} deleted successfully`,
    });
  });

// eslint-disable-next-line default-param-last
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (Model.modelName === "Product") {
      const categories = await Category.find().select("_id"); // Fetch all categories and select only the _id field
      const categoryIds = categories.map((category) => category._id.toString()); // Extract the _id values as strings

      const products = await Model.find(); // Fetch all products

      for (const product of products) {
        if (
          !product.category ||
          !categoryIds.includes(product.category._id.toString())
        ) {
          // If the category is null or does not exist in the category list
          await Model.deleteOne({ _id: product._id }); // Delete the product
          console.log(
            `Deleted product with _id: ${product._id} and category: ${product.category}`
          );
        }
      }
    }
    // Update model
    const model = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, user: req.user._id ? req.user._id : null },
      {
        new: true,
      }
    );
    if (!model) {
      return next(
        new ApiError(
          `${Model.modelName} not found for id: ${req.params.id}`,
          404
        )
      );
    }

    // Trigger for "save" event
    // model.save();

    res.status(200).json({ status: "success", data: model });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const model = await Model.create({
      ...req.body,
      user: req.user._id ? req.user._id : null,
    });
    // Trigger "save" event is automatically triggered when creating a new document
    res.status(201).json({ status: "success", data: model });
  });

exports.getOne = (Model, populateOptions = null) =>
  asyncHandler(async (req, res, next) => {
    if (Model.modelName === "Product") {
      const categories = await Category.find().select("_id"); // Fetch all categories and select only the _id field
      const categoryIds = categories.map((category) => category._id.toString()); // Extract the _id values as strings

      const products = await Model.find(); // Fetch all products

      for (const product of products) {
        if (
          !product.category ||
          !categoryIds.includes(product.category._id.toString())
        ) {
          // If the category is null or does not exist in the category list
          await Model.deleteOne({ _id: product._id }); // Delete the product
          console.log(
            `Deleted product with _id: ${product._id} and category: ${product.category}`
          );
        }
      }
    }
    const { id } = req.params;

    // Build Query
    let model = Model.findById(id);
    if (populateOptions) {
      model = model.populate(populateOptions);
    }

    // Execute Query
    model = await model;
    if (!model) {
      return next(
        new ApiError(
          `${Model.modelName} not found for id: ${req.params.id}`,
          404
        )
      );
    }
    // res stops the middleware chain
    res.status(200).json({ status: "success", data: model });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    if (Model.modelName === "Product") {
      const categories = await Category.find().select("_id"); // Fetch all categories and select only the _id field
      const categoryIds = categories.map((category) => category._id.toString()); // Extract the _id values as strings

      const products = await Model.find(); // Fetch all products

      for (const product of products) {
        if (
          !product.category ||
          !categoryIds.includes(product.category._id.toString())
        ) {
          // If the category is null or does not exist in the category list
          await Model.deleteOne({ _id: product._id }); // Delete the product
          console.log(
            `Deleted product with _id: ${product._id} and category: ${product.category}`
          );
        }
      }
    }

    // Build Query
    const countDocuments = await Model.countDocuments();
    const apiPagination = new ApiPagination(
      Model.find(req.filterObj || {}),
      req.query
    ).paginate(countDocuments);

    // Execute Query
    const { mongooseQuery, paginationResult } = apiPagination;
    const Docs = await mongooseQuery;
    res.status(200).json({
      status: "success",
      results: Docs.length,
      pagination: paginationResult,
      data: Docs,
    });
  });
