const express = require("express");
const {
  signUpController,
  signInController,
} = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/sign-up", signUpController);
userRouter.post("/sign-in", signInController);

module.exports = userRouter;
