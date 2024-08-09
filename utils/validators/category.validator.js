const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorErrorHandling.middleware");
const CategoryModel = require("../../models/category.model");

// Category Validator

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format !!"),
  validatorMiddleware,
]; // Array of rules.

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required !!")
    .isLength({ min: 3 })
    .withMessage("Too short category name !!")
    .isLength({ max: 32 })
    .withMessage("Too long category name !!"),
  check("type").optional(),
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("subcategories must be an array"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format !!"),
  check("name").optional(),
  check("type").optional(),
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("subcategories must be an array"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format !!"),
  validatorMiddleware,
];

// Sub Category Validator

exports.createSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short subcategory name !!")
    .isLength({ max: 32 })
    .withMessage("Too long subcategory name !!"),
  check("subSubcategories")
    .optional()
    .isArray()
    .withMessage("subSubcategories must be an array"),
  validatorMiddleware,
];

exports.getSubCategoriesValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  check("name").optional(),
  check("subSubcategories")
    .optional()
    .isArray()
    .withMessage("subSubcategories must be an array"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getSubSubCategoriesValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.createSubSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short subsubcategory name !!")
    .isLength({ max: 32 })
    .withMessage("Too long subsubcategory name !!"),
  validatorMiddleware,
];

exports.getSubSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  check("subSubCategoryId")
    .isMongoId()
    .withMessage("Invalid subsubcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories
        .id(req.params.subCategoryId)
        .subSubcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subsubcategory with id ${val} in subcategory ${req.params.subCategoryId} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateSubSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),
  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),
  check("subSubCategoryId")
    .isMongoId()
    .withMessage("Invalid subsubcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subCategory = await category.subcategories.id(
        req.params.subCategoryId
      );
      const subSubcategory = await subCategory.subSubcategories.id(val);
      if (!subSubcategory) {
        throw new Error(
          `There is no subsubcategory with id ${val} in subcategory ${req.params.subCategoryId}`
        );
      }
      return true;
    }),
  check("name").optional(),
  validatorMiddleware,
];

exports.deleteSubSubCategoryValidator = [
  check("categoryId")
    .isMongoId()
    .withMessage("Invalid category id format !!")
    .custom(async (val) => {
      const category = await CategoryModel.findById(val);
      if (!category) {
        throw new Error(`There is no category with id ${val}`);
      }
      return true;
    }),

  check("subCategoryId")
    .isMongoId()
    .withMessage("Invalid subcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subcategory = await category.subcategories.id(val);
      if (!subcategory) {
        throw new Error(
          `There is no subcategory with id ${val} in category ${req.params.categoryId}`
        );
      }
      return true;
    }),

  check("subSubCategoryId")
    .isMongoId()
    .withMessage("Invalid subsubcategory id format !!")
    .custom(async (val, { req }) => {
      const category = await CategoryModel.findById(req.params.categoryId);
      const subCategory = await category.subcategories.id(
        req.params.subCategoryId
      );
      const subSubcategory = await subCategory.subSubcategories.id(val);
      if (!subSubcategory) {
        throw new Error(
          `There is no subsubcategory with id ${val} in subcategory ${req.params.subCategoryId}`
        );
      }
      return true;
    }),

  validatorMiddleware,
];
