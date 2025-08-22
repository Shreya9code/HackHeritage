const express = require('express');
const router = express.Router();
const EWasteItem = require('../models/EWasteItem');

// Get all e-waste items
router.get('/', async (req, res) => {
  try {
    const items = await EWasteItem.find().populate('reportedBy', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new e-waste item
router.post('/', async (req, res) => {
  try {
    const item = new EWasteItem(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await EWasteItem.findById(req.params.id).populate('reportedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;