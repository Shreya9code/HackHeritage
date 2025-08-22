const mongoose = require('mongoose');
const QRCode = require('qrcode');

const ewasteItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Computer', 'Projector', 'Lab Equipment', 'Mobile Device', 'Battery', 'Accessory']
  },
  department: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Reported', 'Collected', 'In Transit', 'Recycled', 'Disposed'],
    default: 'Reported'
  },
  qrCode: {
    type: String
  },
  disposalMethod: {
    type: String,
    enum: ['Recyclable', 'Reusable', 'Hazardous']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  disposalDate: {
    type: Date
  }
});

// Generate QR code before saving
ewasteItemSchema.pre('save', async function(next) {
  if (!this.qrCode) {
    try {
      const qrData = JSON.stringify({
        id: this._id,
        name: this.name,
        category: this.category
      });
      this.qrCode = await QRCode.toDataURL(qrData);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('EWasteItem', ewasteItemSchema);