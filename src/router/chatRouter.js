const express = require("express");
const { sendMessage } = require("../controller/chatController");
const isUserAuthenticated = require("../middleware/auth");
const userModel = require("../model/userModel");

const chatRouter = express.Router();

chatRouter.post("/send", isUserAuthenticated, sendMessage);

module.exports = { chatRouter };
