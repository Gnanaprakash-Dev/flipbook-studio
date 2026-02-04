import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 *
 * Mongoose is an ODM (Object Data Modeling) library that:
 * 1. Provides schema validation
 * 2. Converts between JS objects and MongoDB documents
 * 3. Handles connection pooling automatically
 */
const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise
    // It establishes connection to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Return connection for potential use elsewhere
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    // Exit process with failure code
    // In production, you might want to retry instead
    process.exit(1);
  }
};

/**
 * Handle connection events for monitoring
 */
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

// Graceful shutdown - close connection when app terminates
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
