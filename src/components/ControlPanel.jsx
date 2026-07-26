import { ChevronRight } from 'lucide-react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import ManageUsers from './ControlPanel/ManageUsers'
import ManageNotifications from './ControlPanel/ManageNotifications'
import ManageRoles from './ControlPanel/ManageRoles'
import ManagePermissions from './ControlPanel/ManagePermissions'
import ManageSystemPermissions from './ControlPanel/ManageSystemPermissions'
import CreateUser from './ControlPanel/CreateUser'
import CreateAnnouncement from './ControlPanel/CreateAnnouncement'

function ControlPanel({ onBackToDashboard }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'users', label: 'Manage Users', path: '/control-panel/users' },
    { id: 'notifications', label: 'Manage Notifications', path: '/control-panel/notifications' },
    { id: 'roles', label: 'Manage Roles', path: '/control-panel/roles' },
    { id: 'permissions', label: 'Manage Permissions', path: '/control-panel/permissions' },
    { id: 'system', label: 'Manage System Permissions', path: '/control-panel/system' },
  ]

  const handleMenuClick = (menuItem) => {
    navigate(menuItem.path)
  }

  return (
    <div className="control-panel-container">
      <aside className="control-panel-sidebar">
        <div className="control-panel-header">
          <h3>CONTROL PANEL</h3>
        </div>
        <nav className="control-panel-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="control-panel-menu-item"
              onClick={() => handleMenuClick(item)}
            >
              <span className="menu-label">{item.label}</span>
              <ChevronRight size={14} className="menu-arrow" />
            </button>
          ))}
        </nav>
      </aside>

      <main className="control-panel-main">
        <Routes>
          <Route path="/control-panel/users" element={<ManageUsers />} />
          <Route path="/control-panel/users/create" element={<CreateUser />} />
          <Route path="/control-panel/notifications" element={<ManageNotifications />} />
          <Route path="/control-panel/notifications/create" element={<CreateAnnouncement />} />
          <Route path="/control-panel/roles" element={<ManageRoles />} />
          <Route path="/control-panel/permissions" element={<ManagePermissions />} />
          <Route path="/control-panel/system" element={<ManageSystemPermissions />} />
          <Route
            path="/control-panel"
            element={
              <div className="control-panel-welcome">
                <h2>Welcome to Control Panel</h2>
                <p>Select a menu option to get started</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default ControlPanel
