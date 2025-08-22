const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  //password: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Company', companySchema);
