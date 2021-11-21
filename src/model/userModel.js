const JsonWebToken = require("jsonwebtoken");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: false },
  receiverId: { type: String, required: false },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "received", "seen"] },
});

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false, unique: true },
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mobileNumber: { type: Number, required: true, length: 10, unique: true },
    password: { type: String, required: true },
    chats: [messageSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function (userId) {
  return JsonWebToken.sign(
    { id: userId ? userId : this._id },
    process.env.PRIVATEKEY
  );
};

userSchema.methods.resetPassword = function (userId) {};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
