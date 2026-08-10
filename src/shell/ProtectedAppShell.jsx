import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from '../shared/hooks/useAuth'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import DashboardView from '../offers/DashboardView'
import MotorDetail from '../offers/esp-oil-rig/components/MotorDetail'
import ControlPanel from '../control-panel/index'

const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
}

function ProtectedAppShell() {
  const [username, setUsername] = useState(DEMO_CREDENTIALS.username)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password)
  const { user, error, loading, login, logout, isLoggedIn } = useAuth()
  const [showControlPanel, setShowControlPanel] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    await login({ username, password })
  }

  const handleLogout = () => {
    logout()
    setShowControlPanel(false)
  }

  const handleOpenControlPanel = () => {
    setShowControlPanel(true)
  }

  const handleBackToDashboard = () => {
    setShowControlPanel(false)
  }

  if (isLoggedIn && user) {
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
        <p className="hint">DummyJSON demo credentials.</p>

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
