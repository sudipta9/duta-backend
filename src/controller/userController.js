const isUserExists = require("../helper/isUserExists");
const isUserNameExists = require("../helper/isUserNameExists");
const userModel = require("../model/userModel");

const signUpController = async (req, res) => {
  const { password, name, userName, mobileNumber } = req.body;
  if (password && name && userName && mobileNumber) {
    try {
      if (await isUserNameExists(userName)) {
        if (await isUserExists(userName, mobileNumber)) {
          const user = new userModel({
            userName,
            name,
            mobileNumber,
            password,
          });
          await user.save();
          await userModel.updateOne(
            {
              userName: userName,
            },
            { $set: { userId: user._id } }
          );
          const token = await user.generateAccessToken();
          res.status(201).header("token", token).json({
            success: true,
            message: "User created successfully",
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "User already exist",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    } catch (error) {
      console.log(error.msg);
      return res.status(500).json({
        success: false,
        message: "Something happened",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid data provided",
    });
  }
};

const signInController = async (req, res) => {
  const { userName, mobileNumber, password } = req.body;
  if (userName || mobileNumber) {
    try {
      const user = await userModel.findOne({
        $or: [{ userName: userName }, { mobileNumber: mobileNumber }],
      });
      if (!user || user === null) {
        return res.status(401).json({
          success: false,
          message: "User not exists",
        });
      } else {
        if (password) {
          if (password === user.password) {
            const token = user.generateAccessToken(user._id);
            return res.status(200).header("Authorization", token).json({
              success: true,
              token: token,
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Invalid password entered",
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: "Enter your password to login",
          });
        }
      }
    } catch (error) {
      console.log(error.msg);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Enter username or mobile number and password to login",
    });
  }
};

module.exports = { signUpController, signInController };
