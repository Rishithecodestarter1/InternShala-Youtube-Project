// ChannelPage.jsx - Shows channel info and lets the channel owner create, edit, and delete videos.
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosInstance.js'
import { categories } from '../components/FilterBar.jsx'
import VideoCard from '../components/VideoCard.jsx'
import { useAuth } from '../hooks/useAuth.js'

const emptyVideoForm = {
  title: '',
  description: '',
  thumbnailUrl: '',
  videoUrl: '',
  category: 'Web Development',
}

function ChannelPage() {
  const navigate = useNavigate()
  const { channelId } = useParams()
  const { isAuthenticated, updateUser, user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [channelForm, setChannelForm] = useState({ channelName: '', description: '' })
  const [channelErrors, setChannelErrors] = useState({})
  const [channelEditOpen, setChannelEditOpen] = useState(false)
  const [channelEditForm, setChannelEditForm] = useState({ channelName: '', description: '', channelBanner: '' })
  const [videoForm, setVideoForm] = useState(emptyVideoForm)
  const [videoErrors, setVideoErrors] = useState({})
  const [editingVideo, setEditingVideo] = useState(null)
  const [savingVideo, setSavingVideo] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(channelId !== 'new')

  const isNewChannelFlow = channelId === 'new' || !channelId
  const isOwner = Boolean(channel && user?.id === channel.owner)

  useEffect(() => {
    if (isNewChannelFlow) {
      setLoading(false)
      return
    }

    async function loadChannel() {
      setLoading(true)
      const [channelResponse, videosResponse] = await Promise.all([
        api.get(`/channels/${channelId}`),
        api.get(`/channels/${channelId}/videos`),
      ])
      setChannel(channelResponse.data)
      setChannelEditForm({
        channelName: channelResponse.data.channelName || '',
        description: channelResponse.data.description || '',
        channelBanner: channelResponse.data.channelBanner || '',
      })
      setVideos(videosResponse.data)
      setLoading(false)
    }

    loadChannel().catch((apiError) => {
      setError(apiError.response?.data?.message || 'Unable to load channel.')
      setLoading(false)
    })
  }, [channelId, isNewChannelFlow])

  const createChannel = async (event) => {
    event.preventDefault()
    setError('')
    const nextErrors = {}

    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    if (channelForm.channelName.trim().length < 3) nextErrors.channelName = 'Channel name must be at least 3 characters.'
    if (channelForm.description.trim().length < 10) nextErrors.description = 'Description must be at least 10 characters.'

    setChannelErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const response = await api.post('/channels', channelForm)
    updateUser({ channels: [...(user?.channels || []), response.data._id] })
    navigate(`/channel/${response.data._id}`)
  }

  const handleChannelFormChange = (event) => {
    const { name, value } = event.target
    setChannelForm((current) => ({ ...current, [name]: value }))
    setChannelErrors((current) => {
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleChannelEditChange = (event) => {
    const { name, value } = event.target
    setChannelEditForm((current) => ({ ...current, [name]: value }))
    setStatusMessage('')
  }

  const updateChannel = async (event) => {
    event.preventDefault()
    setError('')
    setStatusMessage('')

    try {
      const response = await api.put(`/channels/${channel._id}`, channelEditForm)
      setChannel(response.data)
      setChannelEditOpen(false)
      setStatusMessage('Channel details saved.')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to update channel.')
    }
  }

  const handleVideoFormChange = (event) => {
    const { name, value } = event.target
    setVideoForm((current) => ({ ...current, [name]: value }))
    setStatusMessage('')
    setVideoErrors((current) => {
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const resetVideoForm = () => {
    setVideoForm(emptyVideoForm)
    setVideoErrors({})
    setEditingVideo(null)
    setShowVideoForm(false)
    setError('')
    setStatusMessage('')
  }

  const validateVideoForm = () => {
    const nextErrors = {}

    if (videoForm.title.trim().length < 3) nextErrors.title = 'Title must be at least 3 characters.'
    if (!videoForm.thumbnailUrl.trim()) nextErrors.thumbnailUrl = 'Thumbnail URL is required.'
    if (!videoForm.videoUrl.trim()) nextErrors.videoUrl = 'Video URL is required.'
    if (videoForm.description.trim().length < 10) nextErrors.description = 'Description must be at least 10 characters.'
    if (!videoForm.category || videoForm.category === 'All') nextErrors.category = 'Choose a video category.'

    setVideoErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const submitVideo = async (event) => {
    event.preventDefault()
    setError('')
    setStatusMessage('')

    if (!validateVideoForm()) return

    try {
      setSavingVideo(true)
      if (editingVideo) {
        const response = await api.put(`/videos/${editingVideo._id}`, videoForm)
        setVideos((current) => current.map((video) => (video._id === editingVideo._id ? response.data : video)))
        resetVideoForm()
        setStatusMessage('Video changes saved.')
      } else {
        const response = await api.post('/videos', { ...videoForm, channelId: channel._id })
        // The new video is immediately added to local state so the user sees it without a full page reload.
        setVideos((current) => [response.data, ...current])
        resetVideoForm()
        setStatusMessage('Video uploaded and added to this channel.')
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to save video.')
    } finally {
      setSavingVideo(false)
    }
  }

  const startEdit = (video) => {
    setError('')
    setStatusMessage('')
    setEditingVideo(video)
    setVideoForm({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      category: video.category,
    })
    setShowVideoForm(true)
  }

  const deleteVideo = async (video) => {
    try {
      setError('')
      setStatusMessage('')
      await api.delete(`/videos/${video._id}`)
      setVideos((current) => current.filter((item) => item._id !== video._id))
      setStatusMessage('Video deleted from this channel.')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to delete video.')
    }
  }

  if (loading) return <p className="page-message">Loading channel...</p>

  if (isNewChannelFlow) {
    return (
      <section className="channel-page">
        <h1>Create Channel</h1>
        {!isAuthenticated && <p className="error-text">Please sign in before creating a channel.</p>}
        <form className="form-card" onSubmit={createChannel}>
          <div className="form-field">
            <label htmlFor="channelName">Channel Name</label>
            <input id="channelName" name="channelName" value={channelForm.channelName} aria-invalid={Boolean(channelErrors.channelName)} onChange={handleChannelFormChange} />
            {channelErrors.channelName && <span className="error-text">{channelErrors.channelName}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={channelForm.description} aria-invalid={Boolean(channelErrors.description)} onChange={handleChannelFormChange} />
            {channelErrors.description && <span className="error-text">{channelErrors.description}</span>}
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit">
            Create Channel
          </button>
        </form>
      </section>
    )
  }

  if (error && !channel) return <p className="error-text">{error}</p>

  return (
    <section className="channel-page">
      <div className="channel-banner">{channel?.channelName}</div>
      <div className="channel-header">
        <div>
          <h1>{channel?.channelName}</h1>
          <p>{channel?.description}</p>
          <p>{channel?.subscribers} subscribers</p>
        </div>
        {isOwner && (
          <div className="channel-actions">
            <button className="primary-button" type="button" onClick={() => setShowVideoForm((isOpen) => !isOpen)}>
              Upload Video
            </button>
            <button className="secondary-button" type="button" onClick={() => setChannelEditOpen((isOpen) => !isOpen)}>
              Edit Channel
            </button>
          </div>
        )}
      </div>

      {error && !showVideoForm && <p className="error-text">{error}</p>}
      {statusMessage && <p className="success-text">{statusMessage}</p>}

      {channelEditOpen && (
        <form className="form-card video-form" onSubmit={updateChannel}>
          <div className="form-field">
            <label htmlFor="editChannelName">Channel Name</label>
            <input id="editChannelName" name="channelName" value={channelEditForm.channelName} onChange={handleChannelEditChange} />
          </div>
          <div className="form-field">
            <label htmlFor="editChannelDescription">Description</label>
            <textarea id="editChannelDescription" name="description" value={channelEditForm.description} onChange={handleChannelEditChange} />
          </div>
          <div className="form-field">
            <label htmlFor="editChannelBanner">Banner URL</label>
            <input id="editChannelBanner" name="channelBanner" value={channelEditForm.channelBanner} onChange={handleChannelEditChange} />
          </div>
          <div className="form-actions">
            <button className="primary-button" type="submit">
              Save Channel
            </button>
            <button className="secondary-button" type="button" onClick={() => setChannelEditOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {showVideoForm && (
        <form className="form-card video-form" onSubmit={submitVideo}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={videoForm.title} aria-invalid={Boolean(videoErrors.title)} onChange={handleVideoFormChange} />
            {videoErrors.title && <span className="error-text">{videoErrors.title}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="thumbnailUrl">Thumbnail URL</label>
            <input id="thumbnailUrl" name="thumbnailUrl" value={videoForm.thumbnailUrl} aria-invalid={Boolean(videoErrors.thumbnailUrl)} onChange={handleVideoFormChange} />
            {videoErrors.thumbnailUrl && <span className="error-text">{videoErrors.thumbnailUrl}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="videoUrl">Video URL</label>
            <input id="videoUrl" name="videoUrl" value={videoForm.videoUrl} aria-invalid={Boolean(videoErrors.videoUrl)} onChange={handleVideoFormChange} />
            {videoErrors.videoUrl && <span className="error-text">{videoErrors.videoUrl}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={videoForm.category} aria-invalid={Boolean(videoErrors.category)} onChange={handleVideoFormChange}>
              {categories.filter((category) => category !== 'All').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {videoErrors.category && <span className="error-text">{videoErrors.category}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="videoDescription">Description</label>
            <textarea id="videoDescription" name="description" value={videoForm.description} aria-invalid={Boolean(videoErrors.description)} onChange={handleVideoFormChange} />
            {videoErrors.description && <span className="error-text">{videoErrors.description}</span>}
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={savingVideo}>
              {savingVideo ? 'Saving...' : editingVideo ? 'Save Video' : 'Upload Video'}
            </button>
            <button className="secondary-button" type="button" disabled={savingVideo} onClick={resetVideoForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {videos.length === 0 ? (
        <p className="page-message">{isOwner ? 'Upload your first video to start building this channel.' : 'This channel has no videos yet.'}</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} showOwnerActions={isOwner} onEdit={startEdit} onDelete={deleteVideo} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ChannelPage
