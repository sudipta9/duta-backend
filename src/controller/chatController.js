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
    if (senderId !== receiverId) {
      try {
        const userChat = await chatModel.findOne({
          $and: [{ userId: senderId }, { otherPersonId: receiverId }],
        });
        const receiverChat = await chatModel.findOne({
          $and: [{ userId: receiverId }, { otherPersonId: senderId }],
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
              otherPersonId: receiverId,
              unReadCount: 0,
            });
            const newReceiverChat = new chatModel({
              userId: receiverId,
              otherPersonId: senderId,
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
      return res.status(400).json({
        success: false,
        message: "message to own ID is not permitted",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "unknown error occurred, please login again",
    });
  }
};

const getAllChats = async (req, res) => {
  const userId = req.userId;
  //   console.log(userId);
  try {
    const userChats = await chatModel.find({
      userId: userId,
    });
    // console.log(userChats);
    return res.status(200).json({
      success: true,
      data: userChats,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something Happened",
    });
  }
};

const getUserChat = async (req, res) => {
  const userId = req.userId;
  const otherPersonId = req.body.otherPersonId;
  if (otherPersonId) {
    try {
      const chats = await chatModel.findOne({
        $and: [{ userId: userId }, { otherPersonId: otherPersonId }],
      });
      if (!chats || chats === null) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }
      await chatModel.updateMany(
        {
          $and: [
            { userId: otherPersonId },
            { otherPersonId: userId },
            { "chats.seenOrNot": "unseen" },
          ],
        },
        {
          $set: {
            "chats.$[].seenOrNot": "seen",
          },
        }
      );
      chats.unReadCount = 0;
      await chats.save();

      return res.status(200).json({
        success: true,
        data: chats.chats,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "unexpected error occurred",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "person Id not provided",
    });
  }
};

module.exports = { sendMessageController, getAllChats, getUserChat };
