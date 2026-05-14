const express = require('express');
const router = express.Router();
const techController = require('../controllers/technicianController');
const { auth } = require('../middleware/auth');

router.get('/tasks', auth, techController.getTasks);
router.post('/update-status', auth, techController.updateStatus);

module.exports = router;
