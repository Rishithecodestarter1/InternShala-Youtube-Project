// Sidebar.jsx - Collapsible left navigation panel controlled by the hamburger button.
import { NavLink } from 'react-router-dom'

const primaryLinks = [
  { label: 'Home', to: '/' },
  { label: 'Trending', to: '/?category=News' },
  { label: 'Subscriptions', to: '/?category=Live' },
  { label: 'History', to: '/?category=All' },
  { label: 'Playlists', to: '/?category=Music' },
  { label: 'Watch Later', to: '/?category=Education' },
  { label: 'Liked Videos', to: '/?category=All' },
]

const exploreLinks = ['Shopping', 'Music', 'Movies', 'Live', 'Gaming', 'News', 'Sports']

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <nav aria-label="Main navigation">
          {primaryLinks.map((link) => (
            <NavLink className="sidebar__link" key={link.label} to={link.to} onClick={onClose}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__divider" />
        <h2 className="sidebar__heading">Explore</h2>
        <nav aria-label="Explore navigation">
          {exploreLinks.map((label) => (
            <NavLink className="sidebar__link" key={label} to={`/?category=${encodeURIComponent(label)}`} onClick={onClose}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {isOpen && <button className="sidebar-overlay" type="button" aria-label="Close sidebar" onClick={onClose} />}
    </>
  )
}

export default Sidebar
