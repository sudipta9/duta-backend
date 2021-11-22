const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    messageBody: { type: String, required: true },
    status: { type: String, enum: ["sent", "received"] },
    seenOrNot: { type: String, enum: ["seen", "unseen"] },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  otherPersonId: { type: mongoose.Schema.ObjectId, ref: "users" },
  chats: [messageSchema],
  unReadCount: { type: Number },
});

const chatModel = mongoose.model("chats", chatSchema);
module.exports = chatModel;
