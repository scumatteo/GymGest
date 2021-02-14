const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PlanSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "usermodel" },
  coach: { type: Schema.Types.ObjectId, ref: "usermodel" },
  initialDate: Date,
  finalDate: Date,
  goal: String,
  duration: String,
  exercises: String,
});
module.exports = mongoose.model("planmodel", PlanSchema, "plans");
