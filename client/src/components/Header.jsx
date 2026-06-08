// Header.jsx - YouTube-style top navigation bar with menu, logo, search, and auth state.
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, logout, user } = useAuth()
  const channelLink = user?.channels?.[0] ? `/channel/${user.channels[0]}` : '/channel/new'

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = formData.get('search')?.trim() || ''
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/')
  }

  return (
    <header className="site-header">
      <div className="site-header__left">
        <button className="icon-button" type="button" aria-label="Toggle sidebar" onClick={onMenuClick}>
          ☰
        </button>
        <Link className="site-logo" to="/">
          <span className="site-logo__mark">▶</span>
          <span>youtube-clone</span>
        </Link>
      </div>

      <form className="site-search" onSubmit={handleSubmit}>
        <input name="search" type="search" placeholder="Search" defaultValue={searchParams.get('search') || ''} />
        <button type="submit" aria-label="Search videos">
          🔍
        </button>
      </form>

      <div className="site-header__right">
        {!isAuthenticated ? (
          <Link className="sign-in-link" to="/auth">
            Sign In
          </Link>
        ) : (
          <>
            <Link className="secondary-button" to={channelLink}>
              Your Channel
            </Link>
            <span className="user-chip">
              <span className="user-chip__avatar">{user?.username?.slice(0, 1).toUpperCase()}</span>
              <span>{user?.username}</span>
            </span>
            <button className="secondary-button" type="button" onClick={logout}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
