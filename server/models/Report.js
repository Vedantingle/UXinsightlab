const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Made optional temporarily for unauthenticated testing
  },
  url: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  audits: [{
    issue: String,
    suggestion: String,
    scoreImpact: Number,
    category: String,
    whyMatters: String,
    howToFix: String,
    learnMore: String
  }],
  summary: {
    type: String,
    required: false
  },
  strengths: [{
    type: String
  }],
  areasForImprovement: [{
    type: String
  }],
  heuristics: [{
    title: String,
    score: Number,
    explanation: String,
    recommendation: String
  }],
  categoryScores: {
    seo: Number,
    accessibility: Number,
    ux: Number
  }
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
