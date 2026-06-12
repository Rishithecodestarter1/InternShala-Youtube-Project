// Video.js - Mongoose schema for video metadata. Videos are stored as URL strings, not actual files.
import mongoose from 'mongoose'

export const categories = [
  'All',
  'Education',
  'Entertainment',
  'Web Development',
  'JavaScript',
  'Data Structures',
  'Music',
  'Gaming',
  'News',
  'Live',
  'Sports',
  'Cooking',
]

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
      trim: true,
    },
    uploader: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: true,
      enum: categories.filter((category) => category !== 'All'),
    },
  },
  { timestamps: true },
)

const Video = mongoose.model('Video', videoSchema)

export default Video
