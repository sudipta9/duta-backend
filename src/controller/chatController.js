const chatModel = require("../model/chatModel");
const userModel = require("../model/userModel");

const sendMessageController = async (req, res) => {
  const senderId = req.userId;
  const receiverId = req.body.receiverId;
  const message = req.body.message;
  if (senderId && receiverId) {
    if (!message)
      return res.status(400).json({
        success: false,
        message: "Please enter some message",
      });
    try {
      const userChat = await chatModel.findOne({
        $and: [{ userId: senderId }, { receiverId: receiverId }],
      });
      const receiverChat = await chatModel.findOne({
        $and: [{ userId: receiverId }, { senderId: senderId }],
      });
      if (userChat && receiverChat) {
        userChat.chats.push({
          messageBody: message,
          status: "sent",
          seenOrNot: "unseen",
        });
        receiverChat.chats.push({
          messageBody: message,
          status: "received",
        });
        receiverChat.unReadCount += 1;
        await userChat.save();
        await receiverChat.save();
      } else {
        if (await userModel.exists({ userId: receiverId })) {
          const newUserChat = new chatModel({
            userId: senderId,
            receiverId: receiverId,
            unReadCount: 0,
          });
          const newReceiverChat = new chatModel({
            userId: receiverId,
            senderId: senderId,
            unReadCount: 0,
          });
          newUserChat.chats.push({
            messageBody: message,
            status: "sent",
            seenOrNot: "unseen",
          });
          newReceiverChat.chats.push({
            messageBody: message,
            status: "received",
          });
          newReceiverChat.unReadCount += 1;
          await newUserChat.save();
          await newReceiverChat.save();
        } else {
          return res.status(400).json({
            success: false,
            message: "User Not Exists",
          });
        }
      }
      return res.status(200).json({
        success: true,
        message: "Message Sent",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Something happened please try again",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "unknown error occurred, please login again",
    });
  }
};

module.exports = { sendMessageController };
