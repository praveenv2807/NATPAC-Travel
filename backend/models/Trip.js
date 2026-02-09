const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  startKM: { type: Number, required: true },
  endKM: { type: Number, required: true },
  purpose: { type: String, default: "Official" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", TripSchema);
