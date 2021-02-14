const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InfoSchema = new Schema({
  name: String,
  address: String,
  email: String,
  phone: String,
  date: [{ day: Number, initialHour: String, finalHour: String }],
});
module.exports = mongoose.model("infomodel", InfoSchema, "info");
