const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  schoolName: String,
  collegeName: String,
  inChargeName: String,
  inChargePhone: String,
  mileage: String,
  email: String,
  route: String,
  seats: String,
  numBuses: String,
  requirement: String,
  strength: String,
  financier: String,
  existingModel: String,
  weakness: String,
  category: String,
  location: String,
  leadScore: Number,
  status: { type: String, default: "New" } // NEW field for Lead Status
});

module.exports = mongoose.model('Lead', leadSchema);