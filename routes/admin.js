const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authAdmin } = require('../middleware/auth');

router.use(auth, authAdmin);

router.get('/dashboard', adminController.getDashboardData);
router.get('/users', adminController.getAllUsers);
router.get('/anomalies', adminController.getAllAnomalies);
router.get('/complaints', adminController.getAllComplaints);
router.get('/readings', adminController.getAllReadings);
router.post('/technician', adminController.addTechnician);
router.get('/technicians', adminController.getTechnicians);
router.post('/assign-complaint', adminController.assignComplaint);

module.exports = router;
