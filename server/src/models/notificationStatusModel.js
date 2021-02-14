const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationStatusSchema = new Schema({
  status: String,
});
module.exports = mongoose.model("notificationstatusmodel", NotificationStatusSchema, "notificationstatus");