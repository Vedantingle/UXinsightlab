const User = require('../models/User');
const Report = require('../models/Report');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const totalScans = await Report.countDocuments({ userId: req.user._id });
    
    // Calculate average score safely
    const reports = await Report.find({ userId: req.user._id }).select('score');
    const averageScore = reports.length > 0 
      ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)
      : 0;

    res.json({
        user,
        stats: {
            totalScans,
            averageScore
        }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

const updateQuizResult = async (req, res) => {
    const { score, category, difficulty } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.lastQuizResult = {
            score,
            category,
            difficulty,
            date: new Date()
        };
        await user.save();
        res.json({ message: 'Quiz result saved', lastQuizResult: user.lastQuizResult });
    } catch (error) {
        res.status(500).json({ message: 'Error saving quiz result' });
    }
}

module.exports = { getProfile, updateQuizResult };
