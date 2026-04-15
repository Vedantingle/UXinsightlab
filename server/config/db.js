const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message} - Please start your database!`);
    // Removed process.exit(1) so the express server can still start for other routes
  }
};

module.exports = connectDB;
