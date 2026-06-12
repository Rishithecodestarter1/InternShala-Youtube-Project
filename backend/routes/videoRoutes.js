// videoRoutes.js - CRUD operations for videos. Some routes are public, others require authentication.
import express from 'express'
import {
  createVideo,
  deleteVideo,
  getVideoById,
  getVideos,
  toggleDislike,
  toggleLike,
  updateVideo,
} from '../controllers/videoController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getVideos)
router.get('/:id', getVideoById)
router.post('/', protect, createVideo)
router.put('/:id', protect, updateVideo)
router.delete('/:id', protect, deleteVideo)
router.post('/:id/like', protect, toggleLike)
router.post('/:id/dislike', protect, toggleDislike)
router.put('/:id/like', protect, toggleLike)
router.put('/:id/dislike', protect, toggleDislike)

export default router
