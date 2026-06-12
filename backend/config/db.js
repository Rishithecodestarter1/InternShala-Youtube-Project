// db.js - Connects the Express backend to MongoDB using Mongoose.
import mongoose from 'mongoose'
import { success } from '../utils/colorLog.js'

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri || mongoUri === 'your_mongodb_connection_string_here') {
    throw new Error('MONGO_URI is missing. Add a MongoDB connection string to backend/.env.')
  }

  await mongoose.connect(mongoUri)
  success('MongoDB connected')
}
