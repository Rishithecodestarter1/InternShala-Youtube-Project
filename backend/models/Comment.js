// Comment.js - Mongoose schema for video comments. Nested comments are not supported; all comments are flat.
import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
