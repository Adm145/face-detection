import { Link } from 'react-router-dom'

export default function AdminOnlyNotice({ message = 'You need to be logged in as admin to view this page.' }) {
  return (
    <main className="notice-page">
      <div className="notice-shell">
        <div className="notice-card">
          <p>{message}</p>
          <Link to="/login" className="btn-primary">
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
