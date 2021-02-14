const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: String,
  fromUser: {type: Schema.Types.ObjectId, ref: "usermodel"},
  toUser: {type: Schema.Types.ObjectId, ref: "usermodel"},
  timestamp: String,
  status:  {type: Schema.Types.ObjectId, ref: "messagestatusmodel"},
});
module.exports = mongoose.model("messagemodel", MessageSchema, "messages");