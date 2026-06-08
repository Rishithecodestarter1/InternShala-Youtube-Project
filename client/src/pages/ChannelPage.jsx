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
  const [videoForm, setVideoForm] = useState(emptyVideoForm)
  const [editingVideo, setEditingVideo] = useState(null)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(channelId !== 'new')

  const isNewChannelFlow = channelId === 'new'
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

    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    const response = await api.post('/channels', channelForm)
    updateUser({ channels: [...(user?.channels || []), response.data._id] })
    navigate(`/channel/${response.data._id}`)
  }

  const handleVideoFormChange = (event) => {
    setVideoForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitVideo = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (editingVideo) {
        const response = await api.put(`/videos/${editingVideo._id}`, videoForm)
        setVideos((current) => current.map((video) => (video._id === editingVideo._id ? response.data : video)))
      } else {
        const response = await api.post('/videos', { ...videoForm, channelId: channel._id })
        // The new video is immediately added to local state so the user sees it without a full page reload.
        setVideos((current) => [response.data, ...current])
      }
      setVideoForm(emptyVideoForm)
      setEditingVideo(null)
      setShowVideoForm(false)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to save video.')
    }
  }

  const startEdit = (video) => {
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
    await api.delete(`/videos/${video._id}`)
    setVideos((current) => current.filter((item) => item._id !== video._id))
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
            <input id="channelName" value={channelForm.channelName} onChange={(event) => setChannelForm((current) => ({ ...current, channelName: event.target.value }))} />
          </div>
          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={channelForm.description} onChange={(event) => setChannelForm((current) => ({ ...current, description: event.target.value }))} />
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
          <button className="primary-button" type="button" onClick={() => setShowVideoForm((isOpen) => !isOpen)}>
            Upload Video
          </button>
        )}
      </div>

      {showVideoForm && (
        <form className="form-card video-form" onSubmit={submitVideo}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={videoForm.title} onChange={handleVideoFormChange} />
          </div>
          <div className="form-field">
            <label htmlFor="thumbnailUrl">Thumbnail URL</label>
            <input id="thumbnailUrl" name="thumbnailUrl" value={videoForm.thumbnailUrl} onChange={handleVideoFormChange} />
          </div>
          <div className="form-field">
            <label htmlFor="videoUrl">Video URL</label>
            <input id="videoUrl" name="videoUrl" value={videoForm.videoUrl} onChange={handleVideoFormChange} />
          </div>
          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={videoForm.category} onChange={handleVideoFormChange}>
              {categories.filter((category) => category !== 'All').map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="videoDescription">Description</label>
            <textarea id="videoDescription" name="description" value={videoForm.description} onChange={handleVideoFormChange} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit">
            {editingVideo ? 'Save Video' : 'Upload Video'}
          </button>
        </form>
      )}

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} showOwnerActions={isOwner} onEdit={startEdit} onDelete={deleteVideo} />
        ))}
      </div>
    </section>
  )
}

export default ChannelPage
