const express = require("express");
const userValidator = require("../utils/validators/user.validator");
const {
  getUsers,
  getAdmins,
  createUser,
  getUser,
  updateAdmin,
  deleteUser,
  changeUserPassword,
  filterRoles,
  updateOnlyAdmin,
} = require("../services/userService");

const AuthorizedService = require("../services/authService");

const router = express.Router();

// Admin (Users) Routes

router.use(AuthorizedService.authProtect);

router.use(AuthorizedService.allowedTo("admin"));

router.get("/", filterRoles("user"), getUsers);

router.get("/admins", filterRoles("admin"), getAdmins);

router
  .get("/:id", ...userValidator.getUserValidator, getUser)
  .delete("/:id", ...userValidator.deleteUserValidator, deleteUser);

router.post("/admins", ...userValidator.createUserValidator, createUser);

router.put(
  "/admins/:id",
  updateOnlyAdmin,
  ...userValidator.updateUserValidator,
  updateAdmin
);

router.put(
  "/changePassword/:id",
  ...userValidator.changeUserPasswordValidator,
  changeUserPassword
);

module.exports = { router };
