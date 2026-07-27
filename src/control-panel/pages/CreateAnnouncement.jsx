import { useState } from 'react'
import { ArrowLeft, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClickOutside } from '../../shared/hooks/useClickOutside'

function CreateAnnouncement() {
  const navigate = useNavigate()
  const [selectedRoles, setSelectedRoles] = useState([])
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [message, setMessage] = useState('')
  const dropdownRef = useClickOutside(() => setShowRoleDropdown(false), showRoleDropdown)

  const roles = ['CF-Admin', 'CF-SME', 'CF-Operator', 'CF-Test', 'CF-Team', 'Demo Role']

  const handleRoleChange = (role) => {
    if (role === 'Select All') {
      if (selectedRoles.length === roles.length) {
        setSelectedRoles([])
      } else {
        setSelectedRoles([...roles])
      }
    } else {
      if (selectedRoles.includes(role)) {
        setSelectedRoles(selectedRoles.filter(r => r !== role))
      } else {
        setSelectedRoles([...selectedRoles, role])
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating announcement:', { selectedRoles, message })
    setSelectedRoles([])
    setMessage('')
    navigate('/control-panel/notifications')
  }

  return (
    <div className="create-announcement-container">
      <div className="create-announcement-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/control-panel/notifications')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              color: '#2fc352',
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <Bell size={20} style={{ color: '#9ca3af' }} />
          <h2>Create Announcement</h2>
        </div>
      </div>

      <div className="create-announcement-content">
        <form onSubmit={handleSubmit}>
          {/* Select Roles Field */}
          <div className="form-group">
            <label className="form-label">
              Select Roles <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div className="role-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className="role-dropdown-button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                Select Roles
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ transform: showRoleDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {showRoleDropdown && (
                <div className="role-dropdown-menu">
                  <label className="role-option">
                    <input
                      type="checkbox"
                      checked={selectedRoles.length === roles.length && roles.length > 0}
                      onChange={() => handleRoleChange('Select All')}
                    />
                    <span>Select All</span>
                  </label>

                  {roles.map((role) => (
                    <label key={role} className="role-option">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notification Message Field */}
          <div className="form-group">
            <label className="form-label">
              Notification Message <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="form-textarea"
              placeholder="Enter your announcement message here"
              rows="6"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/control-panel/notifications')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAnnouncement
