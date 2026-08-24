import { Link } from 'react-router-dom'

export default function PeopleEmptyState() {
  return (
    <div className="people-empty">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h2>No people enrolled yet</h2>
      <p>Enrolled faces will show up here once you add someone.</p>
      <Link to="/" className="btn-primary">
        Enroll your first person
      </Link>
    </div>
  )
}
