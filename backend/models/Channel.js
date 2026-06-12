// Channel.js - Mongoose schema for user channels. Each user can own one or more channels.
import mongoose from 'mongoose'

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    channelBanner: {
      type: String,
      default: '',
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

const Channel = mongoose.model('Channel', channelSchema)

export default Channel
