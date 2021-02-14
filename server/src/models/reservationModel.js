const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  coach: { type: Schema.Types.ObjectId, ref: "usermodel" },
  user: { type: Schema.Types.ObjectId, ref: "usermodel" },
  notification: { type: Schema.Types.ObjectId, ref: "notificationmodel" },
  date: String,
  initialHour: String,
  finalHour: String,
});

module.exports = mongoose.model("reservationmodel", ReservationSchema, "reservations");
