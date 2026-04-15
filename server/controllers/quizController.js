const Question = require('../models/Question');

const getQuestions = async (req, res) => {
  const { category, difficulty } = req.query;
  try {
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;

    // Fetch up to 5 random questions matching the filter
    let questions;

if (Object.keys(filter).length > 0) {
  questions = await Question.aggregate([
    { $match: filter },
    { $sample: { size: 5 } }
  ]);
} else {
  questions = await Question.aggregate([
    { $sample: { size: 5 } }
  ]);
}
    
    if (questions.length === 0) {
      return res.status(200).json([]);
    }

    // Don't send correct answers, but include metadata for scoring
    const safeQuestions = questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        category: q.category,
        difficulty: q.difficulty
    }));

    res.json(safeQuestions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching questions' });
  }
};

const checkAnswer = async (req, res) => {
  const { questionId, answerIndex } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
        return res.json([]);
    }

    const isCorrect = question.correctOptionIndex === Number(answerIndex);
    res.json({
        isCorrect,
        correctOptionIndex: question.correctOptionIndex,
        explanation: question.explanation
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error checking answer' });
  }
};

module.exports = { getQuestions, checkAnswer };
