// server.js - Entry point for the Express backend. Connects to MongoDB and registers route handlers.
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import channelRoutes from './routes/channelRoutes.js'
import commentAliasRoutes from './routes/commentAliasRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import videoRoutes from './routes/videoRoutes.js'
import { error as logError, info, success } from './utils/colorLog.js'

dotenv.config({ quiet: true })

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)
app.use(express.json())

app.get('/', (_request, response) => {
  response.status(200).json({
    message: 'youtube-clone API is running',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/videos', '/api/channels'],
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/channels', channelRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/videos', commentRoutes)
app.use('/api/comments', commentAliasRoutes)

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found.' })
})

app.use((error, _request, response, _next) => {
  logError(error.message || 'Server error')

  if (error.name === 'CastError') {
    return response.status(400).json({ message: 'Invalid resource id.' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ message: error.message })
  }

  return response.status(error.statusCode || 500).json({
    message: error.message || 'Server error',
  })
})

async function startServer() {
  try {
    await connectDB()
    app.listen(port, () => {
      success(`Server running on port ${port}`)
      info('Frontend can connect from http://localhost:5173 or http://127.0.0.1:5173')
    })
  } catch (error) {
    logError(error.message)
    process.exit(1)
  }
}

startServer()
