const express = require("express");
const categoryValidator = require("../utils/validators/category.validator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  createSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubSubCategories,
  createSubSubCategories,
  updateSubSubCategory,
  deleteSubSubCategory,
} = require("../services/categoryService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

// Global Authorization Middleware

router.use(AuthorizedService.authProtect, AuthorizedService.allowedTo("admin"));

// Categories Routes

router
  .route("/")
  .post(...categoryValidator.createCategoryValidator, createCategory)
  .get(getCategories);

router
  .route("/:id")
  .get(...categoryValidator.getCategoryValidator, getCategory)
  .put(...categoryValidator.updateCategoryValidator, updateCategory)
  .delete(...categoryValidator.deleteCategoryValidator, deleteCategory);

// SubCategories Routes

router
  .route("/:categoryId/level2")
  .get(...categoryValidator.getSubCategoriesValidator, getSubCategories)
  .post(...categoryValidator.createSubCategoryValidator, createSubCategories);

router
  .route("/:categoryId/level2/:subCategoryId")
  .put(...categoryValidator.updateSubCategoryValidator, updateSubCategory)
  .delete(...categoryValidator.deleteSubCategoryValidator, deleteSubCategory);

// Sub SubCategories Routes

router
  .route("/:categoryId/level2/:subCategoryId/level3")
  .get(...categoryValidator.getSubSubCategoriesValidator, getSubSubCategories)
  .post(
    ...categoryValidator.createSubSubCategoryValidator,
    createSubSubCategories
  );

router
  .route("/:categoryId/level2/:subCategoryId/level3/:subSubCategoryId")
  .put(...categoryValidator.updateSubSubCategoryValidator, updateSubSubCategory)
  .delete(
    ...categoryValidator.deleteSubSubCategoryValidator,
    deleteSubSubCategory
  );

module.exports = { router };
