const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  status: { type: Schema.Types.ObjectId, ref: "notificationstatusmodel" },
  fromUser: { type: Schema.Types.ObjectId, ref: "usermodel" },
  toUser: { type: Schema.Types.ObjectId, ref: "usermodel" },
  seen: Boolean
});
module.exports = mongoose.model("notificationmodel", NotificationSchema, "notifications");
