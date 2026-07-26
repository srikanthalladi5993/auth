import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { selectApplications } from '../../features/dashboard/dashboardSlice'

function ManageRoles() {
  const navigate = useNavigate()
  const applications = useSelector(selectApplications)
  const [roles, setRoles] = useState([
    { id: 1, name: 'CF-Admin', description: 'Common Framework Admin', selectedApps: [], accessLevel: 'Read' },
    { id: 2, name: 'CF-SME', description: 'Common Framework SME', selectedApps: [], accessLevel: 'Read' },
    { id: 3, name: 'CF-Operator', description: '-', selectedApps: [], accessLevel: 'No Access' },
    { id: 4, name: 'CF-Test', description: 'Lorem', selectedApps: [], accessLevel: 'Read' },
    { id: 5, name: 'CF-Team', description: 'test', selectedApps: [], accessLevel: 'Full Access' },
  ])

  const [openDropdowns, setOpenDropdowns] = useState({})
  const dropdownRefs = useRef({})

  // New role form state
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [newRoleApps, setNewRoleApps] = useState([])
  const [newRoleAccessLevel, setNewRoleAccessLevel] = useState('No Access')

  // Close dropdowns when clicking outside
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

  const toggleDropdown = (roleId, type) => {
    const key = `${roleId}-${type}`
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAppSelect = (roleId, appId) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          let updated = [...role.selectedApps]
          if (updated.includes(appId)) {
            updated = updated.filter((id) => id !== appId)
          } else {
            updated.push(appId)
          }
          return { ...role, selectedApps: updated }
        }
        return role
      })
    )
  }

  const handleSelectAllApps = (roleId) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          return { ...role, selectedApps: applications.map((app) => app.id) }
        }
        return role
      })
    )
  }

  const handleAccessLevelChange = (roleId, level) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === roleId ? { ...role, accessLevel: level } : role))
    )
    setOpenDropdowns((prev) => ({ ...prev, [`${roleId}-access`]: false }))
  }

  const getAppDisplayText = (selectedAppIds) => {
    if (selectedAppIds.length === 0) return 'Select Application'
    if (selectedAppIds.length === applications.length) return 'All applications'
    return `${selectedAppIds.length} selected`
  }

  const accessLevelOptions = ['No Access', 'Read', 'Write', 'Full Access']

  const handleAddNewRole = () => {
    if (newRoleName.trim()) {
      const newRole = {
        id: Math.max(...roles.map((r) => r.id)) + 1,
        name: newRoleName,
        description: newRoleDescription,
        selectedApps: newRoleApps,
        accessLevel: newRoleAccessLevel,
      }
      setRoles((prev) => [newRole, ...prev])
      setNewRoleName('')
      setNewRoleDescription('')
      setNewRoleApps([])
      setNewRoleAccessLevel('No Access')
    }
  }

  const handleNewRoleSelectAllApps = () => {
    setNewRoleApps(applications.map((app) => app.id))
  }

  const handleNewRoleAppSelect = (appId) => {
    let updated = [...newRoleApps]
    if (updated.includes(appId)) {
      updated = updated.filter((id) => id !== appId)
    } else {
      updated.push(appId)
    }
    setNewRoleApps(updated)
  }

  return (
    <div className="control-panel-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2>Manage Roles</h2>
          </div>
          <button
            style={{
              background: '#22c55e',
              color: 'white',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="page-section">
          <table className="admin-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Name</th>
                <th style={{ width: '20%' }}>Description</th>
                <th style={{ width: '20%' }}>Application</th>
                <th style={{ width: '20%' }}>Level Of Access</th>
                <th style={{ width: '25%' }}>Full List Of Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* New Role Input Row */}
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="New Role"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#374151',
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="New Description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      color: '#374151',
                    }}
                  />
                </td>
                <td>
                  <div
                    ref={(el) => (dropdownRefs.current['new-app'] = el)}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => toggleDropdown('new', 'app')}
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
                      <span>{getAppDisplayText(newRoleApps)}</span>
                      <ChevronDown size={16} style={{ color: '#6b7280' }} />
                    </button>

                    {openDropdowns['new-app'] && (
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
                          minWidth: '200px',
                        }}
                      >
                        <div
                          style={{
                            padding: '8px 0',
                            borderBottom: '1px solid #e5e7eb',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleNewRoleSelectAllApps()}
                          onMouseEnter={(e) => (e.target.style.background = '#f3f4f6')}
                          onMouseLeave={(e) => (e.target.style.background = 'white')}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              userSelect: 'none',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={newRoleApps.length === applications.length && applications.length > 0}
                              onChange={() => {}}
                              style={{ marginRight: '8px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: '500' }}>
                              All applications
                            </span>
                          </label>
                        </div>

                        {applications.map((app) => (
                          <div
                            key={app.id}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                userSelect: 'none',
                              }}
                              onClick={() => handleNewRoleAppSelect(app.id)}
                            >
                              <input
                                type="checkbox"
                                checked={newRoleApps.includes(app.id)}
                                onChange={() => {}}
                                style={{ marginRight: '8px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.85rem', color: '#374151' }}>{app.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div
                    ref={(el) => (dropdownRefs.current['new-access'] = el)}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => toggleDropdown('new', 'access')}
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
                      <span>{newRoleAccessLevel}</span>
                      <ChevronDown size={16} style={{ color: '#6b7280' }} />
                    </button>

                    {openDropdowns['new-access'] && (
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
                          minWidth: '150px',
                        }}
                      >
                        {accessLevelOptions.map((level) => (
                          <div
                            key={level}
                            onClick={() => {
                              setNewRoleAccessLevel(level)
                              setOpenDropdowns((prev) => ({ ...prev, ['new-access']: false }))
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
                </td>
                <td>
                  <button
                    onClick={handleAddNewRole}
                    style={{
                      background: '#22c55e',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Add
                  </button>
                </td>
              </tr>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>{role.description}</td>
                  <td>
                    <div
                      ref={(el) => (dropdownRefs.current[`${role.id}-app`] = el)}
                      style={{ position: 'relative' }}
                    >
                      <button
                        onClick={() => toggleDropdown(role.id, 'app')}
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
                        <span>{getAppDisplayText(role.selectedApps)}</span>
                        <ChevronDown size={16} style={{ color: '#6b7280' }} />
                      </button>

                      {openDropdowns[`${role.id}-app`] && (
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
                            minWidth: '200px',
                          }}
                        >
                          <div
                            style={{
                              padding: '8px 0',
                              borderBottom: '1px solid #e5e7eb',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleSelectAllApps(role.id)}
                            onMouseEnter={(e) => (e.target.style.background = '#f3f4f6')}
                            onMouseLeave={(e) => (e.target.style.background = 'white')}
                          >
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                userSelect: 'none',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={role.selectedApps.length === applications.length && applications.length > 0}
                                onChange={() => {}}
                                style={{ marginRight: '8px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: '500' }}>
                                All applications
                              </span>
                            </label>
                          </div>

                          {applications.map((app) => (
                            <div
                              key={app.id}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                            >
                              <label
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                  userSelect: 'none',
                                }}
                                onClick={() => handleAppSelect(role.id, app.id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={role.selectedApps.includes(app.id)}
                                  onChange={() => {}}
                                  style={{ marginRight: '8px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.85rem', color: '#374151' }}>{app.name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div
                      ref={(el) => (dropdownRefs.current[`${role.id}-access`] = el)}
                      style={{ position: 'relative' }}
                    >
                      <button
                        onClick={() => toggleDropdown(role.id, 'access')}
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
                        <span>{role.accessLevel}</span>
                        <ChevronDown size={16} style={{ color: '#6b7280' }} />
                      </button>

                      {openDropdowns[`${role.id}-access`] && (
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
                            minWidth: '150px',
                          }}
                        >
                          {accessLevelOptions.map((level) => (
                            <div
                              key={level}
                              onClick={() => handleAccessLevelChange(role.id, level)}
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
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => navigate('/control-panel/permissions', { state: { role } })}
                        className="action-button" 
                        style={{ background: '#6b7280', color: 'white' }}
                      >
                        Permissions
                      </button>
                      <button className="action-button" style={{ background: '#6b7280', color: 'white' }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={() => {
              console.log('Cancelled')
            }}
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
              console.log('Roles saved:', roles)
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

export default ManageRoles
