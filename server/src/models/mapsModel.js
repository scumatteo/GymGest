const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MapSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "usermodel" },
  date: Date,
  geoJson: Object,
  time: String,
  distance: String,
});
module.exports = mongoose.model("mapmodel", MapSchema, "maps");
