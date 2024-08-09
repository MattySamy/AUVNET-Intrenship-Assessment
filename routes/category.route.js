const express = require("express");
const categoryValidator = require("../utils/validators/category.validator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  getSubCategory,
  createSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubSubCategories,
  getSubSubCategory,
  createSubSubCategories,
  updateSubSubCategory,
  deleteSubSubCategory,
} = require("../services/categoryService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

// Global Authorization Middleware

router.use(AuthorizedService.authProtect);

// Categories Routes

router.post(
  "/",
  AuthorizedService.allowedTo("admin"),
  ...categoryValidator.createCategoryValidator,
  createCategory
);
router.get("/", AuthorizedService.allowedTo("admin", "user"), getCategories);

router
  .route("/:id")
  .get(
    AuthorizedService.allowedTo("admin", "user"),
    ...categoryValidator.getCategoryValidator,
    getCategory
  )
  .put(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.deleteCategoryValidator,
    deleteCategory
  );

// SubCategories Routes

router
  .route("/:categoryId/level2")
  .get(
    AuthorizedService.allowedTo("admin", "user"),
    ...categoryValidator.getSubCategoriesValidator,
    getSubCategories
  )
  .post(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.createSubCategoryValidator,
    createSubCategories
  );

router
  .route("/:categoryId/level2/:subCategoryId")
  .put(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.deleteSubCategoryValidator,
    deleteSubCategory
  )
  .get(
    AuthorizedService.allowedTo("admin", "user"),
    ...categoryValidator.getSubCategoryValidator,
    getSubCategory
  );
// Sub SubCategories Routes

router
  .route("/:categoryId/level2/:subCategoryId/level3")
  .get(
    AuthorizedService.allowedTo("admin", "user"),
    ...categoryValidator.getSubSubCategoriesValidator,
    getSubSubCategories
  )
  .post(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.createSubSubCategoryValidator,
    createSubSubCategories
  );

router
  .route("/:categoryId/level2/:subCategoryId/level3/:subSubCategoryId")
  .put(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.updateSubSubCategoryValidator,
    updateSubSubCategory
  )
  .delete(
    AuthorizedService.allowedTo("admin"),
    ...categoryValidator.deleteSubSubCategoryValidator,
    deleteSubSubCategory
  )
  .get(
    AuthorizedService.allowedTo("admin", "user"),
    ...categoryValidator.getSubSubCategoryValidator,
    getSubSubCategory
  );

module.exports = { router };
