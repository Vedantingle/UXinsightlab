const express = require('express');
const router = express.Router();
const { getProfile, updateQuizResult } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.post('/quiz-result', protect, updateQuizResult);

module.exports = router;
