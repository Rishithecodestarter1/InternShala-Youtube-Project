// HomePage.jsx - Main landing page. Fetches videos from the backend with optional search and category filters.
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axiosInstance.js'
import FilterBar from '../components/FilterBar.jsx'
import VideoCard from '../components/VideoCard.jsx'

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const searchQuery = searchParams.get('search')?.trim() || ''
  const activeCategory = searchParams.get('category') || 'All'

  const requestQuery = useMemo(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (activeCategory && activeCategory !== 'All') params.set('category', activeCategory)
    return params.toString()
  }, [activeCategory, searchQuery])

  const noResultsMessage = useMemo(() => {
    if (searchQuery && activeCategory !== 'All') return `No videos found for "${searchQuery}" in ${activeCategory}.`
    if (searchQuery) return `No videos found for "${searchQuery}".`
    if (activeCategory !== 'All') return `No videos found in ${activeCategory}.`
    return 'No videos found.'
  }, [activeCategory, searchQuery])

  useEffect(() => {
    let isMounted = true

    async function fetchVideos() {
      setLoading(true)
      setError('')

      try {
        const response = await api.get(`/videos${requestQuery ? `?${requestQuery}` : ''}`)
        if (isMounted) setVideos(response.data)
      } catch (apiError) {
        if (isMounted) setError(apiError.response?.data?.message || 'Unable to load videos.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchVideos()

    return () => {
      isMounted = false
    }
  }, [requestQuery])

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams)
    if (category === 'All') nextParams.delete('category')
    else nextParams.set('category', category)
    setSearchParams(nextParams)
  }

  return (
    <section className="home-page">
      <FilterBar activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      {loading && (
        <div className="page-message page-message--loading" role="status">
          <span className="loading-dot" />
          <strong>Loading videos</strong>
          <span>Fetching the latest feed from the API.</span>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && videos.length === 0 && <p className="page-message">{noResultsMessage}</p>}
      {!loading && !error && videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </section>
  )
}

export default HomePage
