// commentController.js - Full CRUD for flat video comments.
import Comment from '../models/Comment.js'
import Video from '../models/Video.js'

export async function getComments(request, response, next) {
  try {
    const comments = await Comment.find({ videoId: request.params.videoId }).sort({ createdAt: -1 })
    return response.status(200).json(comments)
  } catch (error) {
    return next(error)
  }
}

export async function addComment(request, response, next) {
  try {
    const { text } = request.body

    if (!text || !text.trim()) {
      return response.status(400).json({ message: 'Comment text is required.' })
    }

    const video = await Video.findById(request.params.videoId)
    if (!video) {
      return response.status(404).json({ message: 'Video not found.' })
    }

    const comment = await Comment.create({
      videoId: request.params.videoId,
      userId: request.user.id,
      username: request.user.username,
      text: text.trim(),
    })

    return response.status(201).json(comment)
  } catch (error) {
    return next(error)
  }
}

export async function updateComment(request, response, next) {
  try {
    const { text } = request.body
    const comment = await Comment.findById(request.params.commentId)

    if (!comment || comment.videoId !== request.params.videoId) {
      return response.status(404).json({ message: 'Comment not found.' })
    }

    if (comment.userId !== request.user.id) {
      return response.status(403).json({ message: 'Only the comment author can edit this comment.' })
    }

    if (!text || !text.trim()) {
      return response.status(400).json({ message: 'Comment text is required.' })
    }

    comment.text = text.trim()
    const updatedComment = await comment.save()

    return response.status(200).json(updatedComment)
  } catch (error) {
    return next(error)
  }
}

export async function deleteComment(request, response, next) {
  try {
    const comment = await Comment.findById(request.params.commentId)

    if (!comment || comment.videoId !== request.params.videoId) {
      return response.status(404).json({ message: 'Comment not found.' })
    }

    if (comment.userId !== request.user.id) {
      return response.status(403).json({ message: 'Only the comment author can delete this comment.' })
    }

    await Comment.findByIdAndDelete(comment._id)

    return response.status(200).json({ message: 'Comment deleted.' })
  } catch (error) {
    return next(error)
  }
}
