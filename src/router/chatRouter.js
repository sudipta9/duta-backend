const express = require("express");
const {
  sendMessageController,
  getAllChats,
  getUserChat,
} = require("../controller/chatController");
const isUserAuthenticated = require("../middleware/auth");
const chatModel = require("../model/chatModel");
const userModel = require("../model/userModel");

const chatRouter = express.Router();

chatRouter.post("/send", isUserAuthenticated, sendMessageController);
chatRouter.get("/get-all", isUserAuthenticated, getAllChats);
chatRouter.get("/get-user-chat", isUserAuthenticated, getUserChat);

module.exports = { chatRouter };
