const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/errorHandler");
const ApiPagination = require("../utils/apiPagination");
const { findOne } = require("../models/user.model");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let model = await Model.findByIdAndDelete(id);
    if (!model) {
      return next(
        new ApiError(`${Model.modelName} not found for id: ${id}`, 404)
      );
    }

    // Trigger "remove" event launched by mongoose middleware (deprecated for mongoose@6)
    model.deleteOne();

    res.status(200).json({
      status: "success",
      msg: `${Model.modelName} deleted successfully`,
    });
  });

// eslint-disable-next-line default-param-last
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
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
    // if (Model.modelName === "Product") {
    //   let result = Model.deleteMany({
    //     category: null,
    //   });

    //   result = await result;

    //   if (result.deletedCount > 0) {
    //     console.log(
    //       `Deleted ${result.deletedCount} products with category: null`
    //     );
    //   }
    // }

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
