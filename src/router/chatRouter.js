const express = require("express");
const { sendMessageController } = require("../controller/chatController");
const isUserAuthenticated = require("../middleware/auth");
const userModel = require("../model/userModel");

const chatRouter = express.Router();

chatRouter.post("/send", isUserAuthenticated, sendMessageController);
chatRouter.get("/receive", isUserAuthenticated, async (req, res) => {});

module.exports = { chatRouter };
