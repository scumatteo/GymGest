const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenderSchema = new Schema({
  name: String, //uomo o donna
  gender: String //M o F
});
module.exports = mongoose.model("gendermodel", GenderSchema, "genders");
