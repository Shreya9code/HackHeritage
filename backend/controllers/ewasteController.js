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

// Accept e-waste item (vendor function) - change status to "waiting for pickup"
exports.acceptEwasteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorId, notes } = req.body;
    
    console.log('🏭 Vendor accepting e-waste item:', { itemId: id, vendorId, notes });
    
    // Find and update the item status
    const ewaste = await Ewaste.findByIdAndUpdate(
      id,
      { 
        status: 'waiting for pickup',
        vendorAcceptedBy: vendorId,
        vendorAcceptedAt: new Date(),
        vendorNotes: notes,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!ewaste) {
      return res.status(404).json({ message: 'E-waste item not found' });
    }
    
    console.log('✅ Item accepted by vendor successfully:', ewaste.serial, 'Status:', ewaste.status);
    res.status(200).json(ewaste);
  } catch (err) {
    console.error('❌ Error accepting e-waste item:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get e-waste items by donor ID (Clerk ID)
exports.getEwasteByDonorId = async (req, res) => {
  try {
    const { donorId } = req.params;
    console.log('🔍 Fetching e-waste items for donor ID:', donorId);
    
    // First, let's see what's in the database
    const allEwastes = await Ewaste.find();
    console.log('📊 Total e-waste items in database:', allEwastes.length);
    
    // Check for items without donorId
    const itemsWithoutDonorId = allEwastes.filter(item => !item.donorId);
    if (itemsWithoutDonorId.length > 0) {
      console.log('⚠️  WARNING: Found items without donorId:', itemsWithoutDonorId.map(item => ({ serial: item.serial, _id: item._id })));
    }
    
    console.log('📋 All items donor IDs:', allEwastes.map(item => ({ serial: item.serial, donorId: item.donorId })));
    
    // Try multiple filtering approaches to ensure we get the right results
    
    // Method 1: Direct MongoDB query
    const mongoQuery = { donorId: donorId };
    console.log('🔍 MongoDB query being used:', JSON.stringify(mongoQuery));
    const ewastesFromMongo = await Ewaste.find(mongoQuery);
    console.log('📦 MongoDB query returned:', ewastesFromMongo.length, 'items');
    
    // Method 2: Manual JavaScript filtering (exact match)
    const exactMatch = allEwastes.filter(item => item.donorId === donorId);
    console.log('🔍 Exact match found:', exactMatch.length, 'items');
    
    // Method 3: Case-insensitive matching (in case there are case differences)
    const caseInsensitiveMatch = allEwastes.filter(item => 
      item.donorId && item.donorId.toLowerCase() === donorId.toLowerCase()
    );
    console.log('🔍 Case-insensitive match found:', caseInsensitiveMatch.length, 'items');
    
    // Method 4: Trimmed matching (in case there are whitespace issues)
    const trimmedMatch = allEwastes.filter(item => 
      item.donorId && item.donorId.trim() === donorId.trim()
    );
    console.log('🔍 Trimmed match found:', trimmedMatch.length, 'items');
    
    // Use the most restrictive result to ensure we don't show other donors' items
    let finalResults = exactMatch;
    
    // If exact match is empty but we have other matches, log a warning
    if (exactMatch.length === 0 && (caseInsensitiveMatch.length > 0 || trimmedMatch.length > 0)) {
      console.log('⚠️  WARNING: Exact match failed but found matches with other methods!');
      console.log('This suggests there might be data inconsistency in the database.');
      console.log('Using exact match (empty result) to ensure security.');
    }
    
    // If we still have no results, double-check by logging all donor IDs
    if (finalResults.length === 0) {
      console.log('🔍 No items found for donor ID:', donorId);
      console.log('🔍 All unique donor IDs in database:', [...new Set(allEwastes.map(item => item.donorId).filter(Boolean))]);
    }
    
    console.log('✅ Final result - items for donor', donorId, ':', finalResults.length);
    console.log('📦 Final items:', finalResults.map(item => ({ serial: item.serial, donorId: item.donorId })));
    
    res.status(200).json(finalResults);
  } catch (err) {
    console.error('❌ Error in getEwasteByDonorId:', err);
    res.status(500).json({ error: err.message });
  }
};
