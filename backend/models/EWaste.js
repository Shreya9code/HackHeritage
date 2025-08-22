const mongoose = require('mongoose');

const ewasteSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  serial: { type: String, required: true, unique: true }, // Unique serial number for QR codes
  itemType: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  age: { type: String },
  weightValue: { type: String },
  weightUnit: { type: String, enum: ['kg', 'g'], default: 'kg' },
  condition: { type: String },
  pickupAddress: { type: String, required: true },
  date: { type: Date, required: true },
  pictureUrl: { type: String },
  shortNote: { type: String },
  classification: { type: String, enum: ['hazardous', 'reusable', 'recyclable'], default: 'recyclable' },
  estimatedPrice: { type: Number, default: 0 },
  status: { type: String, enum: ['waiting for pickup', 'in transit', 'processing', 'done'], default: 'waiting for pickup' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ewaste', ewasteSchema);
