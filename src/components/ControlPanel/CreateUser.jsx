import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function CreateUser() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const roles = ['CF-Admin', 'CF-SME', 'CF-Operator', 'CF-Test', 'CF-Team', 'Demo Role']

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false)
      }
    }

    if (showRoleDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRoleDropdown])

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
    console.log('Creating user:', { email, selectedRoles })
    setEmail('')
    setSelectedRoles([])
    navigate('/control-panel/users')
  }

  return (
    <div className="create-user-container">
      <div className="create-user-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/control-panel/users')}
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
          <User size={20} style={{ color: '#9ca3af' }} />
          <h2>Create User</h2>
        </div>
      </div>

      <div className="create-user-content">
        <form onSubmit={handleSubmit}>
          {/* Email and Roles Row */}
          <div className="form-row">
            {/* Email Field */}
            <div className="form-group form-group-email">
              <label className="form-label">
                Email <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
                <Mail size={18} style={{ color: '#9ca3af' }} />
              </div>
            </div>

            {/* Roles Field */}
            <div className="form-group form-group-roles">
              <label className="form-label">Roles</label>
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
          </div>

          {/* Selected Roles Display */}
          {selectedRoles.length > 0 && (
            <div className="selected-roles-section">
              <label className="form-label">Selected Roles:</label>
              <div className="selected-roles-list">
                {selectedRoles.map((role) => (
                  <span key={role} className="role-badge">
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className="role-badge-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/control-panel/users')}
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

export default CreateUser
