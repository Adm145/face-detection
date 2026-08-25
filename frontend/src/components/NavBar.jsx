import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Enroll' },
  { to: '/people', label: 'People' },
  { to: '/search', label: 'Search' },
]

export default function NavBar() {
  const { pathname } = useLocation()

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-brand">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 6V3a1 1 0 0 1 1-1h3M18 6V3a1 1 0 0 0-1-1h-3M2 14v3a1 1 0 0 0 1 1h3M18 14v3a1 1 0 0 1-1 1h-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>FaceDB</span>
      </Link>

      <div className="nav-links">
        {LINKS.map((link) => {
          const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
          return (
            <Link key={link.to} to={link.to} className={`nav-link${isActive ? ' nav-link-active' : ''}`}>
              {link.label}
            </Link>
          )
        })}
        <span className="nav-link-disabled">Compare</span>
      </div>

      <div className="nav-spacer" />
    </nav>
  )
}
