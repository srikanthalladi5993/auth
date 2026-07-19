import { useEffect, useState } from 'react'
import axiosClient from './api/axiosClient'
import { clearAuthSession, getStoredUser, isAuthenticated, saveAuthSession } from './utils/authStorage'
import './App.css'

const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
}

function App() {
  const [username, setUsername] = useState(DEMO_CREDENTIALS.username)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password)
  const [user, setUser] = useState(() => getStoredUser())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axiosClient.post('/auth/login', {
        username,
        password,
      })

      const { accessToken, refreshToken, ...userData } = response.data
      saveAuthSession({ accessToken, refreshToken, ...userData })
      setUser(userData)
    } catch (loginError) {
      setError('Login failed. Please check the credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthSession()
    setUser(null)
  }

  if (isAuthenticated() && user) {
    return (
      <div className="auth-shell">
        <div className="card">
          <h1>Welcome, {user.firstName || user.username}</h1>
          <p>You are logged in successfully.</p>
          <button className="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <form className="card" onSubmit={handleLogin}>
        <h1>Login</h1>
        <p className="hint">Use the DummyJSON demo credentials.</p>

        <label className="field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? <p className="error">{error}</p> : null}

        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default App
