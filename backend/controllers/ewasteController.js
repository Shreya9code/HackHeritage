const Ewaste = require('../models/EWaste');
const Donor = require('../models/Donor');

// Donor reports e-waste
exports.createEwaste = async (req, res) => {
  try {
    const donorId = req.body.donorId;
    
    // Validate that donorId (Clerk ID) is provided
    if (!donorId) {
      return res.status(400).json({ error: 'Donor ID (Clerk ID) is required' });
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
    const ewastes = await Ewaste.find();
    res.status(200).json(ewastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single e-waste by ID (for QR code scan)
exports.getEwasteById = async (req, res) => {
  try {
    const ewaste = await Ewaste.findById(req.params.id);
    if (!ewaste) return res.status(404).json({ message: 'E-waste not found' });
    res.status(200).json(ewaste);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single e-waste by serial number (for QR code scan)
exports.getEwasteBySerial = async (req, res) => {
  try {
    const ewaste = await Ewaste.findOne({ serial: req.params.serial });
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

// Get e-waste items by donor ID (Clerk ID)
exports.getEwasteByDonorId = async (req, res) => {
  try {
    const { donorId } = req.params;
    const ewastes = await Ewaste.find({ donorId });
    res.status(200).json(ewastes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
