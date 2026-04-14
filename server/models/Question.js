const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
  },
  category: {
    type: String,
    enum: ['SEO', 'Accessibility', 'UX'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
