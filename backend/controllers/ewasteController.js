const Ewaste = require('../models/EWaste');
const Donor = require('../models/Donor');

// Donor reports e-waste
exports.createEwaste = async (req, res) => {
  try {
    let donorId = req.body.donorId;
    
    // If no donorId is provided, create a placeholder donor for testing
    if (!donorId) {
      const placeholderDonor = await Donor.create({
        name: 'Anonymous Donor',
        contactNumber: 'N/A',
        address: req.body.pickupAddress || 'N/A',
        email: 'anonymous@ewaste.com'
      });
      donorId = placeholderDonor._id;
    }
    
    const ewasteData = { ...req.body, donorId };
    const ewaste = await Ewaste.create(ewasteData);
    res.status(201).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all e-waste for vendors
exports.getAllEwastes = async (req, res) => {
  try {
    const ewastes = await Ewaste.find().populate('donorId', 'name contactNumber address email');
    res.status(200).json(ewastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single e-waste by ID (for QR code scan)
exports.getEwasteById = async (req, res) => {
  try {
    const ewaste = await Ewaste.findById(req.params.id).populate('donorId', 'name contactNumber address email');
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single e-waste by serial number (for QR code scan)
exports.getEwasteBySerial = async (req, res) => {
  try {
    const ewaste = await Ewaste.findOne({ serial: req.params.serial }).populate('donorId', 'name contactNumber address email');
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const ewaste = await Ewaste.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status by serial number
exports.updateStatusBySerial = async (req, res) => {
  try {
    const ewaste = await Ewaste.findOneAndUpdate(
      { serial: req.params.serial }, 
      { 
        status: req.body.status,
        updatedAt: new Date()
      }, 
      { new: true }
    );
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
