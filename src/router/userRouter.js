const express = require("express");
const {
  signUpController,
  signInController,
  userFindController,
} = require("../controller/userController");
const isUserAuthenticated = require("../middleware/auth");
const userModel = require("../model/userModel");

const userRouter = express.Router();

userRouter.post("/sign-up", signUpController);
userRouter.post("/sign-in", signInController);
userRouter.get("/all-user", isUserAuthenticated, async (req, res) => {
  const ownId = req.userId;
  const users = await userModel.find({ userId: { $ne: ownId } });
  return res.status(200).json({
    success: true,
    data: users,
  });
});
userRouter.get("/find", isUserAuthenticated, userFindController);

module.exports = userRouter;
