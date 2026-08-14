import { useState } from 'react'
import { Bell, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClickOutside } from '../../shared/hooks/useClickOutside'

function ManageNotifications() {
  const navigate = useNavigate()
  const [notifications] = useState([
    { id: 1, type: 'System', category: 'System (warnings, errors...)', message: 'Protected by copyright law and international treaties. © 2026 Schneider Electric Industries. All Rights Reserved.', createdOn: 'May 26, 2026 12:49:43 PM' },
    { id: 2, type: 'Announcement', category: 'Announcement', message: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form by injected humour.', createdOn: 'May 22, 2026 03:54:02 PM' },
    { id: 3, type: 'Application', category: 'Application', message: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature.', createdOn: 'May 22, 2026 03:40:12 PM' },
    { id: 4, type: 'System', category: 'System', message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', createdOn: 'May 22, 2026 03:35:10 PM' },
    { id: 5, type: 'Alert', category: 'Alert', message: 'Emergency Alert: Action should be taken immediately.', createdOn: 'May 22, 2026 03:30:48 PM' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [showTypeFilter, setShowTypeFilter] = useState(false)
  const filterRef = useClickOutside(() => setShowTypeFilter(false), showTypeFilter)

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'System (warnings, errors...)', value: 'System' },
    { label: 'User commands, feedback', value: 'User' },
    { label: 'Announcement', value: 'Announcement' },
    { label: 'Application', value: 'Application' },
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case 'System':
        return '#2563eb'
      case 'Announcement':
        return '#ea8c55'
      case 'Application':
        return '#ea8c55'
      case 'Alert':
        return '#dc2626'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="control-panel-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2>Manage Notifications</h2>
          </div>
          <button
            onClick={() => navigate('/control-panel/notifications/create')}
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
              flexShrink: 0,
            }}
          >
            Create Announcement
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="page-section">
          {/* Filter Section */}
          <div className="notification-filters" ref={filterRef}>
            <div className="filter-row-top">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Search Notifications"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="filter-icon-btn" onClick={() => setShowTypeFilter(!showTypeFilter)}>
                  <Filter size={16} />
                </button>

                {showTypeFilter && (
                  <div className="filter-dropdown">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`filter-option ${filterType === option.value ? 'active' : ''}`}
                        onClick={() => {
                          setFilterType(option.value)
                          setShowTypeFilter(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="notifications-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Type</th>
                <th>Message</th>
                <th style={{ width: '160px', whiteSpace: 'nowrap' }}>Created On</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif.id}>
                  <td style={{ textAlign: 'center' }}>
                    <Bell size={18} color={getTypeColor(notif.type)} />
                  </td>
                  <td>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {notif.message}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {notif.createdOn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageNotifications
