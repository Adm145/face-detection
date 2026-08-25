import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!username.trim() || !password || status === 'submitting') return

    setStatus('submitting')
    setErrorMessage('')

    try {
      await login(username.trim(), password)
      navigate('/')
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong')
      setStatus('error')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <header className="login-header">
          <span className="badge">Admin</span>
          <h1>Log in.</h1>
          <p className="login-subtitle">Enrolling, editing, and deleting people requires an admin login.</p>
        </header>

        <form className="login-card" onSubmit={handleSubmit}>
          {status === 'error' && <div className="error-banner">{errorMessage}</div>}

          <div className="field field-full">
            <span className="field-label">Username</span>
            <input
              className="text-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="field field-full">
            <span className="field-label">Password</span>
            <input
              className="text-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={!username.trim() || !password || status === 'submitting'}
          >
            {status === 'submitting' ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </main>
  )
}
