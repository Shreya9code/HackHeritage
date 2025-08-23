const mongoose = require('mongoose');

const ewasteSchema = new mongoose.Schema({
  donorId: { type: String, required: true }, // Clerk ID of the donor
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
  status: { type: String, enum: ['reported', 'waiting for pickup', 'in transit', 'processing', 'done'], default: 'reported' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Vendor acceptance fields
  vendorAcceptedBy: { type: String }, // Clerk ID of vendor who accepted
  vendorAcceptedAt: { type: Date }, // When vendor accepted
  vendorNotes: { type: String }, // Vendor notes when accepting
  // In transit fields
  inTransitBy: { type: String }, // Clerk ID of vendor who picked up
  inTransitAt: { type: Date }, // When item went into transit
  inTransitNotes: { type: String }, // Vendor notes when picking up
});

module.exports = mongoose.model('Ewaste', ewasteSchema);
