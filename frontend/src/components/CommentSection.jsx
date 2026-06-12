// CommentSection.jsx - Full CRUD comment system for a video. Add, edit, and delete comments without nesting.
import { useEffect, useState } from 'react'
import api from '../api/axiosInstance.js'
import { useAuth } from '../hooks/useAuth.js'

function CommentSection({ videoId }) {
  const { isAuthenticated, user } = useAuth()
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editingText, setEditingText] = useState('')
  const [deletePromptId, setDeletePromptId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadComments() {
      const response = await api.get(`/videos/${videoId}/comments`)
      setComments(response.data)
    }

    loadComments().catch((apiError) => setError(apiError.response?.data?.message || 'Unable to load comments.'))
  }, [videoId])

  const addComment = async (event) => {
    event.preventDefault()
    setError('')
    const trimmedText = text.trim()

    if (!isAuthenticated) {
      setError('Please sign in to comment.')
      return
    }

    if (!trimmedText) {
      setError('Comment text is required.')
      return
    }

    const response = await api.post(`/videos/${videoId}/comments`, { text: trimmedText })
    setComments((current) => [response.data, ...current])
    setText('')
  }

  const saveEdit = async (commentId) => {
    const trimmedText = editingText.trim()
    if (!trimmedText) {
      setError('Edited comment text is required.')
      return
    }

    const response = await api.put(`/videos/${videoId}/comments/${commentId}`, { text: trimmedText })
    setComments((current) => current.map((comment) => (comment._id === commentId ? response.data : comment)))
    setEditingId('')
    setEditingText('')
    setError('')
  }

  const deleteComment = async (commentId) => {
    await api.delete(`/videos/${videoId}/comments/${commentId}`)
    setComments((current) => current.filter((comment) => comment._id !== commentId))
    setDeletePromptId('')
  }

  return (
    <section className="comments-section">
      <h2>{comments.length} Comments</h2>
      <form className="comment-form" onSubmit={addComment}>
        <input value={text} placeholder={isAuthenticated ? 'Add a comment...' : 'Sign in to comment'} onChange={(event) => setText(event.target.value)} />
        <button className="primary-button" type="submit">
          Add Comment
        </button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <div className="comments-list">
        {comments.map((comment) => {
          const isOwner = user?.id === comment.userId
          return (
            <article className="comment-card" key={comment._id}>
              <p className="comment-card__meta">
                <strong>{comment.username}</strong> {new Date(comment.createdAt).toLocaleString()}
              </p>
              {editingId === comment._id ? (
                <div className="comment-edit">
                  <input value={editingText} onChange={(event) => setEditingText(event.target.value)} />
                  <button className="primary-button" type="button" onClick={() => saveEdit(comment._id)}>
                    Save
                  </button>
                </div>
              ) : (
                <p>{comment.text}</p>
              )}
              {isOwner && (
                <div className="comment-card__actions">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setEditingId(comment._id)
                      setEditingText(comment.text)
                    }}
                  >
                    Edit
                  </button>
                  <button className="danger-button" type="button" onClick={() => setDeletePromptId(comment._id)}>
                    Delete
                  </button>
                </div>
              )}
              {deletePromptId === comment._id && (
                <div className="inline-confirm">
                  <span>Are you sure?</span>
                  <button className="danger-button" type="button" onClick={() => deleteComment(comment._id)}>
                    Yes
                  </button>
                  <button className="secondary-button" type="button" onClick={() => setDeletePromptId('')}>
                    No
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default CommentSection
