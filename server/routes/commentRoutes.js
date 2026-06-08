// commentRoutes.js - Full CRUD for comments on videos. All operations except reading require authentication.
import express from 'express'
import { addComment, deleteComment, getComments, updateComment } from '../controllers/commentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/:videoId/comments', getComments)
router.post('/:videoId/comments', protect, addComment)
router.put('/:videoId/comments/:commentId', protect, updateComment)
router.delete('/:videoId/comments/:commentId', protect, deleteComment)

export default router
