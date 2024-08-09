const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorErrorHandling.middleware");
const CategoryModel = require("../../models/category.model");
const UserModel = require("../../models/user.model");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required !!")
    .isLength({ min: 3 })
    .withMessage("Too short Product name !!")
    .isLength({ max: 100 })
    .withMessage("Too long Product name !!"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required !!")
    .isLength({ min: 20 })
    .withMessage("Too short Product description !!")
    .isLength({ max: 2000 })
    .withMessage("Too long Product description !!"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required !!")
    .isNumeric()
    .withMessage("Product quantity must be a number !!"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number !!")
    .custom((value, { req }) => {
      if (value > req.body.quantity) {
        throw new Error("Product sold can't be more than product quantity !!");
      }
      return true;
    }),
  check("price")
    .notEmpty()
    .withMessage("Product price is required !!")
    .isNumeric()
    .withMessage("Product price must be a number !!")
    .isLength({ max: 20 })
    .withMessage("Too long Product price !!"),
  check("category")
    .notEmpty()
    .withMessage("Product must be related to a specific category !!")
    .isMongoId()
    .withMessage("Invalid Category id format !!")
    .custom(async (categoryId) => {
      const categoryExists = await CategoryModel.findById(categoryId);
      if (!categoryExists) {
        throw new Error(
          `Category with id: ${categoryId} does not exist in mongoDB !!`
        );
      }
      return true;
    }),
  check("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid User id format !!")
    .custom(async (userId, { req }) => {
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
        throw new Error(`User with id: ${userId} does not exist in mongoDB !!`);
      }
      if (userExists._id.toString() !== req.user._id.toString()) {
        throw new Error(`User with id: ${userId} is not authorized !!`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Category id format !!"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format !!"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short Product name !!")
    .isLength({ max: 100 })
    .withMessage("Too long Product name !!"),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short Product description !!")
    .isLength({ max: 2000 })
    .withMessage("Too long Product description !!"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number !!"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number !!")
    .custom((value, { req }) => {
      if (value > req.body.quantity) {
        throw new Error("Product sold can't be more than product quantity !!");
      }
      return true;
    }),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number !!")
    .isLength({ max: 20 })
    .withMessage("Too long Product price !!"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category id format !!")
    .custom(async (categoryId) => {
      const categoryExists = await CategoryModel.findById(categoryId);
      if (!categoryExists) {
        throw new Error(
          `Category with id: ${categoryId} does not exist in mongoDB !!`
        );
      }
      return true;
    }),
  check("user")
    .optional()
    .isMongoId()
    .withMessage("Invalid User id format !!")
    .custom(async (userId, { req }) => {
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
        throw new Error(`User with id: ${userId} does not exist in mongoDB !!`);
      }
      if (userExists._id.toString() !== req.user._id.toString()) {
        throw new Error(`User with id: ${userId} is not authorized !!`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format !!"),
  validatorMiddleware,
];
