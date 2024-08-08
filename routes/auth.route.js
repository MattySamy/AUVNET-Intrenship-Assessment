const express = require("express");
// const authValidator = require("../utils/validators/auth.validator");
const {
  signUp,
  login,
  refresh,
  authProtect,
  logout,
} = require("../services/authService");

const {
  logInValidator,
  signUpValidator,
} = require("../utils/validators/auth.validator");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp("user"));

router.route("/login").post(logInValidator, login);

router.route("/refresh").get(refresh);

router.route("/logout").get(authProtect, logout);
module.exports = { router };
