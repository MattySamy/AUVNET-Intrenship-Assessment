const asyncHandler = require("express-async-handler");

const Category = require("../models/category.model");
const CategoryIterator = require("../utils/categoryIterator");
const { ApiError } = require("../utils/errorHandler");
const factory = require("./handlers.factory");

// @desc Get all categories
// @route GET /api/v1/categories
// @access Private/Admin

exports.getCategories = factory.getAll(Category);

// @desc Get single category
// @route GET /api/v1/categories/:id
// @access Private/Admin

exports.getCategory = factory.getOne(Category);

// @desc Create category
// @route POST /api/v1/categories
// @access Private/Admin

exports.createCategory = factory.createOne(Category);

// @desc Update category
// @route PUT /api/v1/categories/:id
// @access Private/Admin

exports.updateCategory = factory.updateOne(Category);

// @desc Delete category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin

exports.deleteCategory = factory.deleteOne(Category);

// @desc Get sub categories
// @route GET /api/v1/categories/:id/level2
// @access Private/Admin

exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const iterator = new CategoryIterator(category);
  const subCategories = iterator.getSubCategories();
  res.status(200).json({ status: "success", data: subCategories });
});

// @desc Get sub subcategories
// @route GET /api/v1/categories/:id/level2/:subCategoryId/level3
// @access Private/Admin

exports.getSubSubCategories = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);

  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  const subSubCategories = subCategory.subSubcategories;
  res.status(200).json({ status: "success", data: subSubCategories });
});

// @desc Create subcategories
// @route POST /api/v1/categories/:categoryId/level2
// @access Private/Admin

exports.createSubCategories = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const createdSubcategory = await category.subcategories.push(req.body);
  await category.save();

  res.status(200).json({
    status: "success",
    msg: "SubCategory created successfully",
    data: category,
  });
});

// @desc Get single subcategory
// @route GET /api/v1/categories/:categoryId/level2/:subCategoryId
// @access Private/Admin

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);

  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  res.status(200).json({ status: "success", data: subCategory });
});

// @desc Update subcategory
// @route PUT /api/v1/categories/:categoryId/level2/:subCategoryId
// @access Private/Admin

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  subCategory.set(req.body);

  await category.save();

  res.status(200).json({
    status: "success",
    msg: "SubCategory updated successfully",
    data: subCategory,
  });
});

// @desc Delete subcategory
// @route DELETE /api/v1/categories/:categoryId/level2/:subCategoryId
// @access Private/Admin

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  const deletedSubCategory = await category.subcategories
    .id(req.params.subCategoryId)
    .deleteOne();

  await category.save();

  res.status(200).json({
    status: "success",
    msg: "SubCategory deleted successfully",
    data: subCategory,
  });
});

// @desc Create subsubcategories
// @route POST /api/v1/categories/:categoryId/level2/:subCategoryId/level3
// @access Private/Admin

exports.createSubSubCategories = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);

  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  const createdSubSubCategory = await subCategory.subSubcategories.push(
    req.body
  );

  await subCategory.save();
  await category.save();

  res.status(200).json({
    status: "success",
    msg: "SubSubCategory created successfully",
    data: subCategory,
  });
});

// @desc Get single subsubcategory
// @route GET /api/v1/categories/:categoryId/level2/:subCategoryId/level3/:subSubCategoryId
// @access Private/Admin

exports.getSubSubCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  const subSubCategory = await subCategory.subSubcategories.id(
    req.params.subSubCategoryId
  );

  if (!subSubCategory) {
    return next(
      new ApiError(
        `SubSubCategory not found for id: ${req.params.subSubCategoryId}`,
        404
      )
    );
  }

  res.status(200).json({ status: "success", data: subSubCategory });
});

// @desc Update subsubcategory
// @route PUT /api/v1/categories/:categoryId/level2/:subCategoryId/level3/:subSubCategoryId
// @access Private/Admin

exports.updateSubSubCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  const subSubCategory = await subCategory.subSubcategories.id(
    req.params.subSubCategoryId
  );
  if (!subSubCategory) {
    return next(
      new ApiError(
        `SubSubCategory not found for id: ${req.params.subSubCategoryId}`,
        404
      )
    );
  }

  await subSubCategory.set(req.body);

  await subCategory.save();
  await category.save();

  res.status(200).json({
    status: "success",
    msg: "SubSubCategory updated successfully",
    data: subCategory,
  });
});

// @desc Delete subsubcategory
// @route DELETE /api/v1/categories/:categoryId/level2/:subCategoryId/level3/:subSubCategoryId
// @access Private/Admin

exports.deleteSubSubCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ApiError(`Category not found for id: ${req.params.categoryId}`, 404)
    );
  }

  const subCategory = await category.subcategories.id(req.params.subCategoryId);
  if (!subCategory) {
    return next(
      new ApiError(
        `SubCategory not found for id: ${req.params.subCategoryId}`,
        404
      )
    );
  }

  const subSubCategory = await subCategory.subSubcategories.id(
    req.params.subSubCategoryId
  );
  if (!subSubCategory) {
    return next(
      new ApiError(
        `SubSubCategory not found for id: ${req.params.subSubCategoryId}`,
        404
      )
    );
  }

  const deletedSubSubCategory = await subSubCategory.deleteOne();

  await subCategory.save();
  await category.save();

  res.status(200).json({
    status: "success",
    msg: "SubSubCategory deleted successfully",
    data: subSubCategory,
  });
});
