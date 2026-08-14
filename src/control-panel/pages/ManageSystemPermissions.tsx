import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useClickOutside } from '../../shared/hooks/useClickOutside'

type AccessLevel = 'Read' | 'Write' | 'Full Access' | 'No Access'
type PermissionRow = Record<AccessLevel, boolean>
type RolePermissions = Record<string, PermissionRow>

const ACCESS_LEVELS: AccessLevel[] = ['Read', 'Write', 'Full Access', 'No Access']

const ROLE_OPTIONS = [
  { id: 1, name: 'CF-Admin' },
  { id: 2, name: 'CF-SME' },
  { id: 3, name: 'CF-Operator' },
  { id: 4, name: 'CF-Test' },
  { id: 5, name: 'CF-Team' },
]

const SYSTEM_ACTIONS = [
  'Manage User',
  'Manage Roles and Permissions',
  'Manage Notification',
  'Manage Menu Hierarchy',
]

const createPermissionRow = (selectedLevel: AccessLevel): PermissionRow => ({
  Read: selectedLevel === 'Read',
  Write: selectedLevel === 'Write',
  'Full Access': selectedLevel === 'Full Access',
  'No Access': selectedLevel === 'No Access',
})

const createRolePermissions = (defaultLevel: AccessLevel): RolePermissions =>
  SYSTEM_ACTIONS.reduce<RolePermissions>((acc, actionName) => {
    acc[actionName] = createPermissionRow(defaultLevel)
    return acc
  }, {})

const INITIAL_ROLE_PERMISSIONS: Record<number, RolePermissions> = {
  1: createRolePermissions('Full Access'),
  2: {
    'Manage User': createPermissionRow('No Access'),
    'Manage Roles and Permissions': createPermissionRow('No Access'),
    'Manage Notification': createPermissionRow('No Access'),
    'Manage Menu Hierarchy': createPermissionRow('Write'),
  },
  3: createRolePermissions('Read'),
  4: createRolePermissions('No Access'),
  5: {
    'Manage User': createPermissionRow('Read'),
    'Manage Roles and Permissions': createPermissionRow('No Access'),
    'Manage Notification': createPermissionRow('Read'),
    'Manage Menu Hierarchy': createPermissionRow('Read'),
  },
}

function ManageSystemPermissions() {
  const [selectedRoleId, setSelectedRoleId] = useState(2)
  const [permissionsByRole, setPermissionsByRole] = useState<Record<number, RolePermissions>>(INITIAL_ROLE_PERMISSIONS)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})

  const isAnyOpen = Object.values(openDropdowns).some(Boolean)
  const dropdownContainerRef = useClickOutside(() => setOpenDropdowns({}), isAnyOpen)

  const selectedRole = useMemo(
    () => ROLE_OPTIONS.find((role) => role.id === selectedRoleId),
    [selectedRoleId]
  )

  const selectedRolePermissions: RolePermissions = permissionsByRole[selectedRoleId] || {}

  const selectedAccessLevel = useMemo(() => {
    const levels = SYSTEM_ACTIONS.map((actionName) => {
      const actionPermissions = selectedRolePermissions[actionName]
      return ACCESS_LEVELS.find((level) => actionPermissions?.[level])
    }).filter(Boolean)

    if (!levels.length) return 'No Access'

    return levels.every((level) => level === levels[0]) ? levels[0] : 'Custom'
  }, [selectedRolePermissions])

  const toggleDropdown = (dropdownKey: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [dropdownKey]: !prev[dropdownKey] }))
  }

  const applyAccessToAction = (actionName: string, selectedLevel: AccessLevel) => {
    setPermissionsByRole((prev) => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        [actionName]: createPermissionRow(selectedLevel),
      },
    }))
  }

  const applyAccessToAllActions = (selectedLevel: AccessLevel) => {
    setPermissionsByRole((prev) => ({
      ...prev,
      [selectedRoleId]: SYSTEM_ACTIONS.reduce<RolePermissions>((acc, actionName) => {
        acc[actionName] = createPermissionRow(selectedLevel)
        return acc
      }, {}),
    }))
  }

  const resetCurrentRole = () => {
    setPermissionsByRole((prev) => ({
      ...prev,
      [selectedRoleId]: INITIAL_ROLE_PERMISSIONS[selectedRoleId],
    }))
  }

  const handleSave = () => {
    console.log('System permissions saved for role:', selectedRole?.name, permissionsByRole[selectedRoleId])
  }

  return (
    <div className="control-panel-page">
      <div className="page-header">
        <h2>Manage System Permissions</h2>
      </div>

      <div className="page-content">
        <div className="page-section" style={{ padding: '14px 16px 16px' }}>
          <div ref={dropdownContainerRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Role
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('role')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: '#374151',
                  }}
                >
                  <span>{selectedRole?.name || 'Select Role'}</span>
                  <ChevronDown size={16} style={{ color: '#6b7280' }} />
                </button>

                {openDropdowns.role && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 20,
                      boxShadow: '0 6px 12px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => {
                          setSelectedRoleId(role.id)
                          setOpenDropdowns((prev) => ({ ...prev, role: false }))
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background = '#f3f4f6'
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background = '#ffffff'
                        }}
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

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Level Of Access
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => toggleDropdown('access')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    background: '#ffffff',
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

                {openDropdowns.access && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      marginTop: '4px',
                      zIndex: 20,
                      boxShadow: '0 6px 12px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    {['Custom', ...ACCESS_LEVELS].map((level) => {
                      const isCustom = level === 'Custom'

                      return (
                        <div
                          key={level}
                          onClick={() => {
                            if (!isCustom) {
                              applyAccessToAllActions(level as AccessLevel)
                            }
                            setOpenDropdowns((prev) => ({ ...prev, access: false }))
                          }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.background = '#f3f4f6'
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background = '#ffffff'
                        }}
                          style={{
                            padding: '8px 12px',
                            cursor: isCustom ? 'default' : 'pointer',
                            fontSize: '0.85rem',
                            color: isCustom ? '#9ca3af' : '#374151',
                          }}
                        >
                          {level}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <h3
            style={{
              marginTop: '18px',
              marginBottom: '10px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#1f3a56',
            }}
          >
            Full list of System Actions
          </h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>List</th>
                {ACCESS_LEVELS.map((level) => (
                  <th key={level} style={{ textAlign: 'center' }}>
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SYSTEM_ACTIONS.map((actionName) => (
                <tr key={actionName}>
                  <td>{actionName}</td>
                  {ACCESS_LEVELS.map((level) => (
                    <td key={level} style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={permissionsByRole[selectedRoleId]?.[actionName]?.[level] || false}
                        onChange={() => applyAccessToAction(actionName, level)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              onClick={resetCurrentRole}
              style={{
                padding: '8px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#ffffff',
                color: '#4b5563',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: '4px',
                background: '#22c55e',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageSystemPermissions
