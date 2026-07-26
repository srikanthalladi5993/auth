import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ManageUsers() {
  const navigate = useNavigate()
  const [users] = useState([
    { id: 1, email: 'john.bradley@techcorp.com', role: 'Demo Role', lastUpdated: 'Jul 09, 2026 16:09:09 PM', status: 'PENDING' },
    { id: 2, email: 'sarah.mitchell@innovate.co', role: 'Demo Role', lastUpdated: 'Jul 09, 2026 16:08:56 PM', status: 'PENDING' },
    { id: 3, email: 'michael.chen@enterprise.io', role: 'CF-Admin', lastUpdated: 'Jul 09, 2026 16:08:45 PM', status: 'ENABLED' },
    { id: 4, email: 'emma.wilson@company.com', role: 'Demo Role', lastUpdated: 'Jul 08, 2026 14:53:50 PM', status: 'ENABLED' },
    { id: 5, email: 'david.kumar@solutions.net', role: 'CF-Admin', lastUpdated: 'Jul 06, 2026 12:44:40 PM', status: 'ENABLED' },
    { id: 6, email: 'lisa.anderson@workspace.org', role: '-', lastUpdated: 'Jul 03, 2026 17:33:36 PM', status: 'DISABLED' },
    { id: 7, email: 'james.rodriguez@digital.dev', role: 'CF-Test', lastUpdated: 'Jun 12, 2026 12:31:09 PM', status: 'ENABLED' },
    { id: 8, email: 'priya.patel@cloud.systems', role: '-', lastUpdated: 'Jun 01, 2026 17:33:51 PM', status: 'INVITE EXPIRED' },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fef08a', color: '#92400e' }
      case 'ENABLED':
        return { bg: '#dcfce7', color: '#166534' }
      case 'DISABLED':
        return { bg: '#fee2e2', color: '#991b1b' }
      case 'INVITE EXPIRED':
        return { bg: '#fecaca', color: '#991b1b' }
      default:
        return { bg: '#e5e7eb', color: '#374151' }
    }
  }

  const getActionButtons = (status) => {
    if (status === 'PENDING' || status === 'INVITE EXPIRED') {
      return ['Edit', 'Delete', 'Resend Invite']
    }
    if (status === 'ENABLED') {
      return ['Edit', 'Delete', 'Disable']
    }
    if (status === 'DISABLED') {
      return ['Edit', 'Delete', 'Enable']
    }
    return ['Edit', 'Delete']
  }

  return (
    <div className="control-panel-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2>Manage Users</h2>
            <p>Add, edit, and manage user accounts</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <input
              type="text"
              placeholder="Search Users"
              className="search-input"
            />
            <button
              onClick={() => navigate('/control-panel/users/create')}
              style={{
                background: '#22c55e',
                color: 'white',
                padding: '8px 14px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="page-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" />
                </th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const statusColor = getStatusColor(user.status)
                const actionButtons = getActionButtons(user.status)
                return (
                  <tr key={user.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td style={{ color: '#0369a1', textDecoration: 'underline' }}>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.lastUpdated}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: statusColor.bg,
                          color: statusColor.color,
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
                        <button className="action-button" style={{ background: '#6b7280', flex: '0 0 auto' }}>
                          Edit
                        </button>
                        <button className="action-button" style={{ background: '#6b7280', flex: '0 0 auto' }}>
                          Delete
                        </button>
                        {actionButtons[2] && (
                          <button
                            className="action-button"
                            style={{
                              background: '#6b7280',
                              flex: '0 0 auto',
                            }}
                          >
                            {actionButtons[2]}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
