const mongoose = require('mongoose');

const EstimateBillSchema = new mongoose.Schema({
  buyerName: String,
  model: String,
  amount: Number,
  gst: Number,
  total: Number
}, { timestamps: true });

module.exports = mongoose.model("EstimateBill", EstimateBillSchema);