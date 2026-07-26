import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import { selectApplications } from '../../features/dashboard/dashboardSlice'

function ManagePermissions() {
  const location = useLocation()
  const navigate = useNavigate()
  const applications = useSelector(selectApplications)
  
  // Get role from location state
  const selectedRole = location.state?.role
  
  const [roles] = useState([
    { id: 1, name: 'CF-Admin' },
    { id: 2, name: 'CF-SME' },
    { id: 3, name: 'CF-Operator' },
    { id: 4, name: 'CF-Test' },
    { id: 5, name: 'CF-Team' },
  ])

  const [selectedRoleId, setSelectedRoleId] = useState(selectedRole?.id || 1)
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '')
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('Read')
  const [openDropdowns, setOpenDropdowns] = useState({})
  const dropdownRefs = useRef({})

  const [permissions, setPermissions] = useState({
    1: {
      'Send Notification': { Read: true, Write: false, 'Full Access': false, 'No Access': false },
      'Create SubNode': { Read: true, Write: false, 'Full Access': false, 'No Access': false },
      'Weather Table': { Read: true, Write: false, 'Full Access': false, 'No Access': false },
    },
    2: {
      'Send Notification': { Read: false, Write: true, 'Full Access': false, 'No Access': false },
      'Create SubNode': { Read: false, Write: true, 'Full Access': false, 'No Access': false },
      'Weather Table': { Read: false, Write: false, 'Full Access': false, 'No Access': true },
    },
    3: {
      'Send Notification': { Read: false, Write: false, 'Full Access': true, 'No Access': false },
      'Create SubNode': { Read: false, Write: false, 'Full Access': true, 'No Access': false },
      'Weather Table': { Read: false, Write: false, 'Full Access': true, 'No Access': false },
    },
    4: {
      'Send Notification': { Read: true, Write: false, 'Full Access': false, 'No Access': false },
      'Create SubNode': { Read: false, Write: false, 'Full Access': false, 'No Access': true },
      'Weather Table': { Read: false, Write: false, 'Full Access': false, 'No Access': true },
    },
    5: {
      'Send Notification': { Read: false, Write: false, 'Full Access': false, 'No Access': true },
      'Create SubNode': { Read: true, Write: false, 'Full Access': false, 'No Access': false },
      'Weather Table': { Read: false, Write: true, 'Full Access': false, 'No Access': false },
    },
  })

  const accessLevelOptions = ['Read', 'Write', 'Full Access', 'No Access']
  const actionsList = ['Send Notification', 'Create SubNode', 'Weather Table']

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setOpenDropdowns((prev) => ({ ...prev, [key]: false }))
        }
      })
    }

    if (Object.values(openDropdowns).some((v) => v)) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdowns])

  const toggleDropdown = (type) => {
    setOpenDropdowns((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const handlePermissionChange = (action, accessLevel) => {
    setPermissions((prev) => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        [action]: {
          Read: false,
          Write: false,
          'Full Access': false,
          'No Access': false,
          [accessLevel]: true,
        },
      },
    }))
  }

  const currentRole = roles.find((r) => r.id === selectedRoleId)
  const currentApp = applications.find((a) => a.id === selectedAppId)

  return (
    <div className="control-panel-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => navigate('/control-panel/roles')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: '#2fc352',
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ margin: 0 }}>Manage Permissions</h2>
        </div>
      </div>

      <div className="page-content">
        <div className="page-section">
          {/* Top Section with Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Role Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                Role
              </label>
              <div ref={(el) => (dropdownRefs.current['role'] = el)} style={{ position: 'relative' }}>
                <button
                  onClick={() => toggleDropdown('role')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: '#374151',
                  }}
                >
                  <span>{currentRole?.name || 'Select Role'}</span>
                  <ChevronDown size={16} style={{ color: '#6b7280' }} />
                </button>

                {openDropdowns['role'] && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 100,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => {
                          setSelectedRoleId(role.id)
                          setOpenDropdowns((prev) => ({ ...prev, role: false }))
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#374151',
                        }}
                      >
                        {role.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Application Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                Application
              </label>
              <div ref={(el) => (dropdownRefs.current['app'] = el)} style={{ position: 'relative' }}>
                <button
                  onClick={() => toggleDropdown('app')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: '#374151',
                  }}
                >
                  <span>{currentApp?.name || 'Select Application'}</span>
                  <ChevronDown size={16} style={{ color: '#6b7280' }} />
                </button>

                {openDropdowns['app'] && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 100,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedAppId(app.id)
                          setOpenDropdowns((prev) => ({ ...prev, app: false }))
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#374151',
                        }}
                      >
                        {app.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Level of Access Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                Level Of Access
              </label>
              <div ref={(el) => (dropdownRefs.current['access'] = el)} style={{ position: 'relative' }}>
                <button
                  onClick={() => toggleDropdown('access')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: '#374151',
                  }}
                >
                  <span>{selectedAccessLevel}</span>
                  <ChevronDown size={16} style={{ color: '#6b7280' }} />
                </button>

                {openDropdowns['access'] && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 100,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {['No Access', 'Read', 'Write', 'Full Access'].map((level) => (
                      <div
                        key={level}
                        onClick={() => {
                          setSelectedAccessLevel(level)
                          setOpenDropdowns((prev) => ({ ...prev, access: false }))
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#374151',
                        }}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full List of Actions */}
          <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '0.95rem', fontWeight: '600', color: '#1f3a56' }}>
            Full List Of Actions
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #d1d5db' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  List
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  Read
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  Write
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  Full Access
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                  No Access
                </th>
              </tr>
            </thead>
            <tbody>
              {actionsList.map((action) => (
                <tr key={action} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontSize: '0.85rem', color: '#374151' }}>{action}</td>
                  {accessLevelOptions.map((level) => (
                    <td key={level} style={{ padding: '12px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={permissions[selectedRoleId]?.[action]?.[level] || false}
                        onChange={() => handlePermissionChange(action, level)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Save/Cancel Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/control-panel/roles')}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              background: '#f9fafb',
              color: '#6b7280',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.8rem',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Permissions saved for role:', currentRole?.name, permissions[selectedRoleId])
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: '#22c55e',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.8rem',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManagePermissions
