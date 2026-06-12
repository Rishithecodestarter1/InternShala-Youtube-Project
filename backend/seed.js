// seed.js - Run once with "npm run seed" to populate MongoDB with sample data for testing.
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import Channel from './models/Channel.js'
import Comment from './models/Comment.js'
import User from './models/User.js'
import Video from './models/Video.js'
import { error as logError, info, success } from './utils/colorLog.js'

dotenv.config({ quiet: true })

const sampleVideos = [
  {
    title: 'Learn React in 30 Minutes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'A quick tutorial to get started with React components, props, and state.',
    views: 15200,
    likes: [],
    dislikes: [],
    category: 'Education',
  },
  {
    title: 'JavaScript Array Methods Explained',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Understand map, filter, reduce, and find with beginner-friendly examples.',
    views: 9800,
    likes: [],
    dislikes: [],
    category: 'Web Development',
  },
  {
    title: 'Data Structures for Interviews',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    description: 'A practical overview of arrays, stacks, queues, linked lists, and trees.',
    views: 22100,
    likes: [],
    dislikes: [],
    category: 'Education',
  },
  {
    title: 'Relaxing Coding Music Mix',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'A calm music session for long study and coding practice.',
    views: 30200,
    likes: [],
    dislikes: [],
    category: 'Music',
  },
  {
    title: 'Gaming UI Design Breakdown',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    description: 'Learn how readable HUDs and game menus are designed.',
    views: 11200,
    likes: [],
    dislikes: [],
    category: 'Gaming',
  },
  {
    title: 'Entertainment Editing Tricks',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Simple editing ideas that make short videos more fun to watch.',
    views: 13400,
    likes: [],
    dislikes: [],
    category: 'Entertainment',
  },
  {
    title: 'Tech News Weekly Roundup',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    description: 'A quick weekly roundup of developer tools, launches, and platform news.',
    views: 6800,
    likes: [],
    dislikes: [],
    category: 'News',
  },
  {
    title: 'Sports Analytics Dashboard Walkthrough',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'A dashboard walkthrough for sports stats and match insights.',
    views: 7400,
    likes: [],
    dislikes: [],
    category: 'Sports',
  },
]

async function seedDatabase() {
  await connectDB()
  info('Clearing old youtube-clone sample data...')

  await Promise.all([User.deleteMany({}), Channel.deleteMany({}), Video.deleteMany({}), Comment.deleteMany({})])

  const password = await bcrypt.hash('password123', 12)

  const john = await User.create({
    username: 'JohnDoe',
    email: 'john@example.com',
    password,
    avatar: '',
  })

  const jane = await User.create({
    username: 'JaneCoder',
    email: 'jane@example.com',
    password,
    avatar: '',
  })

  const channel = await Channel.create({
    channelName: 'Code with John',
    owner: john._id.toString(),
    description: 'Coding tutorials and tech reviews by John Doe.',
    channelBanner: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    subscribers: 5200,
  })

  await User.findByIdAndUpdate(john._id, { $addToSet: { channels: channel._id.toString() } })

  const createdVideos = await Video.insertMany(
    sampleVideos.map((video) => ({
      ...video,
      channelId: channel._id.toString(),
      channelName: channel.channelName,
      uploader: john._id.toString(),
    })),
  )

  await Channel.findByIdAndUpdate(channel._id, {
    $set: { videos: createdVideos.map((video) => video._id.toString()) },
  })

  await Comment.insertMany([
    {
      videoId: createdVideos[0]._id.toString(),
      userId: jane._id.toString(),
      username: jane.username,
      text: 'Great video. Very helpful!',
    },
    {
      videoId: createdVideos[1]._id.toString(),
      userId: john._id.toString(),
      username: john.username,
      text: 'Practice these methods with real examples.',
    },
    {
      videoId: createdVideos[2]._id.toString(),
      userId: jane._id.toString(),
      username: jane.username,
      text: 'This helped me revise before interviews.',
    },
  ])

  success('Database seeded successfully')
  process.exit(0)
}

seedDatabase().catch((error) => {
  logError(error.message || 'Seed failed')
  process.exit(1)
})
