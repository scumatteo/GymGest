const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  coach: { type: Schema.Types.ObjectId, ref: "usermodel" },
  name: String,
  description: String,
  day: Number,
  initialHour: String,
  finalHour: String,
  maxSubscriber: Number,
  users: [{ type: Schema.Types.ObjectId, ref: "usermodel" }],
});
module.exports = mongoose.model("lessonmodel", LessonSchema, "lessons");
