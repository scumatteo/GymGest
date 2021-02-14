const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  CF: { type: String, required: true },
  address: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: Schema.Types.ObjectId, required: true, ref: "gendermodel" },
  phone: String,
  birthday: String,
  bio: String,
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "rolemodel",
  },
  image: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  workingDays: {
    type: [{ day: Number, initialHour: String, finalHour: String }],
    default: undefined,
  },
});
module.exports = mongoose.model("usermodel", UserSchema, "users");
