import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { clearAuthSession, getStoredUser, isAuthenticated, saveAuthSession } from '../utils/authStorage'
import axiosClient from '../api/axiosClient'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import DashboardView from './DashboardView'
import MotorDetail from './MotorDetail'
import ControlPanel from './ControlPanel'

const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
}

function ProtectedAppShell() {
  const [username, setUsername] = useState(DEMO_CREDENTIALS.username)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password)
  const [user, setUser] = useState(() => getStoredUser())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const isLoggedIn = useSelector((state) => isAuthenticated())

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
    setShowControlPanel(false)
  }

  const handleOpenControlPanel = () => {
    setShowControlPanel(true)
  }

  const handleBackToDashboard = () => {
    setShowControlPanel(false)
  }

  if (isAuthenticated() && user) {
    if (showControlPanel) {
      return (
        <BrowserRouter>
          <div className="app-shell">
            <div className="app-content">
              <main className="main-panel" style={{ gridColumn: '1 / -1' }}>
                <TopNav 
                  onLogout={handleLogout} 
                  onOpenControlPanel={handleOpenControlPanel}
                  onBackToDashboard={handleBackToDashboard}
                />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', overflow: 'hidden' }}>
                  <ControlPanel onBackToDashboard={handleBackToDashboard} />
                </div>
              </main>
            </div>
          </div>
        </BrowserRouter>
      )
    }

    return (
      <BrowserRouter>
        <div className="app-shell">
          <div className="app-content">
            <Sidebar />
            <main className="main-panel">
              <TopNav onLogout={handleLogout} onOpenControlPanel={handleOpenControlPanel} />
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/motor/:motorId" element={<MotorDetail />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    )
  }

  return (
    <div className="auth-shell">
      <form className="card" onSubmit={handleLogin}>
        <h1>Login</h1>
        <p className="hint">Use the DummyJSON demo credentials.</p>

        <label className="field">
          <span>Username</span>
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        {error ? <p className="error">{error}</p> : null}

        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default ProtectedAppShell
