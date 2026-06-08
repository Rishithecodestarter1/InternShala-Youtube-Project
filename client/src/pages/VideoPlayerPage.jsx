// VideoPlayerPage.jsx - Shows the video, metadata, like/dislike buttons, and comments.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/axiosInstance.js'
import CommentSection from '../components/CommentSection.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { formatDate, formatViews } from '../utils/formatters.js'

function VideoPlayerPage() {
  const { videoId } = useParams()
  const { isAuthenticated } = useAuth()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadVideo() {
      setLoading(true)
      const response = await api.get(`/videos/${videoId}`)
      setVideo(response.data)
      setLoading(false)
    }

    loadVideo().catch((apiError) => {
      setError(apiError.response?.data?.message || 'Unable to load video.')
      setLoading(false)
    })
  }, [videoId])

  const toggleReaction = async (type) => {
    if (!isAuthenticated) {
      setError('Please sign in to like or dislike.')
      return
    }

    // The backend stores user ids in like/dislike arrays so duplicate votes are prevented.
    const response = await api.put(`/videos/${videoId}/${type}`)
    setVideo(response.data)
  }

  if (loading) return <p className="page-message">Loading video...</p>
  if (error && !video) return <p className="error-text">{error}</p>

  return (
    <section className="watch-page">
      <div className="watch-page__main">
        <video className="watch-player" src={video.videoUrl} controls />
        <h1>{video.title}</h1>
        <p className="video-meta">
          {formatViews(video.views)} · {formatDate(video.uploadDate)}
        </p>
        {error && <p className="error-text">{error}</p>}
        <div className="watch-actions">
          <button className="secondary-button" type="button" onClick={() => toggleReaction('like')}>
            👍 {video.likes.length}
          </button>
          <button className="secondary-button" type="button" onClick={() => toggleReaction('dislike')}>
            👎 {video.dislikes.length}
          </button>
          <Link className="secondary-button" to={`/channel/${video.channelId}`}>
            {video.channelName}
          </Link>
        </div>
        <div className="video-description">
          <p>{video.description}</p>
        </div>
        <CommentSection videoId={videoId} />
      </div>
    </section>
  )
}

export default VideoPlayerPage
