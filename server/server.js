require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const analyzeRoutes = require('./routes/analyzeRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to Database
// Ensure MONGO_URI is set in environment variables!
if (!process.env.MONGO_URI) {
  // Graceful fallback for local development without .env
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/uxanalyzer';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_jwt_key_here';
}

connectDB();

// Middleware
app.use(cors({
  origin: "https://u-xinsightlab.vercel.app/",
  credentials: true
}));
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/users', userRoutes);

// General health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Nodemon restart trigger
