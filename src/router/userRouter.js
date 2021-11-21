const express = require("express");
const { signUpController } = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/sign-up", signUpController);

module.exports = userRouter;
