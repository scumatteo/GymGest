const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageStatusSchema = new Schema({
  status: String,
});
module.exports = mongoose.model("messagestatusmodel", MessageStatusSchema, "messagestatus");