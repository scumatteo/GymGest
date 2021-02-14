const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: "usermodel" },
  user2: { type: Schema.Types.ObjectId, ref: "usermodel" },
});
module.exports = mongoose.model("chatmodel", ChatSchema, "chats");
