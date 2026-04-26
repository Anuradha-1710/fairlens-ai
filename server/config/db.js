const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB connection failed: ${error.message}`);
    console.log('⚠️ Running in offline mode with sample data only');
    console.log('💡 To use MongoDB, install MongoDB locally or provide a valid connection string in .env');
    // Don't exit process - allow server to run with sample data
  }
};

module.exports = connectDB;
