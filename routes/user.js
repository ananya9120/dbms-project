const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.post('/reading', auth, userController.submitReading);
router.get('/dashboard', auth, userController.getDashboardData);
router.get('/prediction', auth, userController.getPrediction);
router.post('/pay-bill', auth, userController.payBill);
router.post('/complaint', auth, userController.submitComplaint);
router.post('/usage-note', auth, userController.submitUsageNote);
router.get('/usage-notes', auth, userController.getUsageNotes);

module.exports = router;
