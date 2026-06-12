// commentAliasRoutes.js - Compatibility routes for comment actions by comment id.
import express from 'express'
import { deleteComment, updateComment } from '../controllers/commentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.put('/:commentId', protect, updateComment)
router.delete('/:commentId', protect, deleteComment)

export default router
