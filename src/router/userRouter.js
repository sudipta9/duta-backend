const express = require("express");
const {
  signUpController,
  signInController,
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
userRouter.get("/find", isUserAuthenticated, async (req, res) => {
  const userName = req.query.userName;

  if (!userName)
    return res.status(400).json({
      success: false,
      message: "username not provided",
    });

  try {
    const user = await userModel.findOne({ userName: userName });
    if (!user && user !== null)
      res.status(200).json({
        error: false,
        message: "user not found",
      });
    return res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        userName: user.userName,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = userRouter;
