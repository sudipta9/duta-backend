const userModel = require("../model/userModel");

const sendMessage = async (req, res) => {
  try {
    const sender = await userModel.findOne({
      $or: [{ userId: req.userId }, { _id: req.userId }],
    });
    const receiver = await userModel.findOne({
      $or: [{ userId: req.body.receiverId }, { _id: req.body.receiverId }],
    });

    let message = req.body.message;

    await sender.chats.push({
      receiverId: receiver._id,
      message: message,
      status: "sent",
    });

    await receiver.chats.push({
      senderId: sender._id,
      message: message,
      status: "received",
    });
    await sender.save();
    await receiver.save();

    return res.status(200).json({
      message: "message sent",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
module.exports = { sendMessage };
