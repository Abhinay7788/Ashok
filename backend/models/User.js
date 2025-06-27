const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true }, // ✅ Added age field
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);