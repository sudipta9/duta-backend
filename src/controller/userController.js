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

module.exports = { signUpController };
