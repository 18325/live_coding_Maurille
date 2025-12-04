
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/notes-app';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing without database connection for development...');
    // Don't exit in development, allow server to run
    // process.exit(1);
  }
};