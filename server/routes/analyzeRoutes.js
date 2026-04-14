const express = require('express');
const router = express.Router();
const { analyzeUrl, getReports, getReportById } = require('../controllers/analyzeController');
const { protect, checkAuth } = require('../middleware/authMiddleware');

// Public scans (guest logic handled in controller)
router.post('/', checkAuth, analyzeUrl);

// Protected data
router.get('/', protect, getReports);
router.get('/:id', protect, getReportById);

module.exports = router;
