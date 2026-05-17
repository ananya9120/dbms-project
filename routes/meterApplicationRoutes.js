const express = require('express');
const router = express.Router();
const meterApplicationController = require('../controllers/meterApplicationController');

router.post('/submit', meterApplicationController.submitApplication);
router.get('/all', meterApplicationController.getAllApplications);

module.exports = router;
