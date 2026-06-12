// VideoCard.jsx - Displays one video thumbnail card and links to its video player page.
import { Link } from 'react-router-dom'
import { formatDate, formatViews } from '../utils/formatters.js'

function VideoCard({ video, showOwnerActions = false, onEdit, onDelete }) {
  return (
    <article className="video-card">
      <Link to={`/watch/${video._id}`}>
        <img className="video-card__thumbnail" src={video.thumbnailUrl} alt={video.title} loading="lazy" />
        <h2 className="video-card__title">{video.title}</h2>
        <p className="video-card__channel">{video.channelName}</p>
        <p className="video-card__meta">
          {formatViews(video.views)} {video.uploadDate ? `· ${formatDate(video.uploadDate)}` : ''}
        </p>
      </Link>
      {showOwnerActions && (
        <div className="video-card__actions">
          <button className="secondary-button" type="button" onClick={() => onEdit(video)}>
            Edit
          </button>
          <button className="danger-button" type="button" onClick={() => onDelete(video)}>
            Delete
          </button>
        </div>
      )}
    </article>
  )
}

export default VideoCard
