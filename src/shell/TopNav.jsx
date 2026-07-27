import { useDispatch, useSelector } from 'react-redux'
import { LogOut, Menu, User, ChevronDown } from 'lucide-react'
import { selectMenu, selectSelectedApp, selectSelectedMenu } from '../features/dashboard/dashboardSlice'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TopNav({ onLogout, onOpenControlPanel, onBackToDashboard }) {
  const selectedApp = useSelector(selectSelectedApp)
  const selectedMenu = useSelector(selectSelectedMenu)
  const dispatch = useDispatch()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleHomeClick = () => {
    onBackToDashboard?.()
    navigate('/')
  }

  return (
    <header className="top-nav-shell">
      <div className="top-status-row">
        <div className="brand-row">
          <button className="icon-button" type="button" aria-label="Open navigation">
            <Menu size={18} />
          </button>
          <h3>Industrial Services Hub</h3>
        </div>

        <div className="top-actions">
          <div className="status-pills" aria-label="system status">
            <span className="status-pill running">RUNNING 6</span>
            <span className="status-pill stopped">STOPPED 0</span>
            <span className="status-pill offline">OFFLINE 0</span>
          </div>

          <div className="user-menu-wrapper">
            <button 
              className="user-chip" 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="current user"
            >
              <User size={15} />
              <span>srikanth alladi</span>
              <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </button>
            
            {userMenuOpen && (
              <div className="user-dropdown-menu">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    onOpenControlPanel()
                    setUserMenuOpen(false)
                  }}
                >
                  Control Panel
                </button>
              </div>
            )}
          </div>

          <button className="logout-button" onClick={onLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="menu-row">
        <button 
          className="nav-link" 
          type="button"
          onClick={handleHomeClick}
        >
          Home
        </button>

        <div className="nav-links">
        {selectedApp.menus.map((menu) => (
          <button
            key={menu.id}
            className={`nav-link ${selectedMenu.id === menu.id ? 'active' : ''}`}
            onClick={() => dispatch(selectMenu(menu.id))}
          >
            {menu.label}
          </button>
        ))}
        </div>
      </div>
    </header>
  )
}

export default TopNav
