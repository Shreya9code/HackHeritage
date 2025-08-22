const express = require('express');
const router = express.Router();
const ewasteController = require('../controllers/ewasteController');

router.post('/', ewasteController.createEwaste); // donor submits form
router.get('/', ewasteController.getAllEwastes); // vendors see all reports
router.get('/donor/:donorId', ewasteController.getEwasteByDonorId); // get items by donor ID
router.get('/:id', ewasteController.getEwasteById); // scan QR
router.get('/serial/:serial', ewasteController.getEwasteBySerial); // get by serial number for QR scan
router.put('/:id/status', ewasteController.updateStatus); // update status
router.put('/serial/:serial/status', ewasteController.updateStatusBySerial); // update status by serial

module.exports = router;
