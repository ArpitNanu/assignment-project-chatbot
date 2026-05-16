import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;