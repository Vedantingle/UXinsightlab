const express = require('express');
const router = express.Router();
const { getQuestions, checkAnswer } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getQuestions);
router.post('/check', checkAnswer);

module.exports = router;
