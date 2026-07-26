function ManageSystemPermissions() {
  return (
    <div className="control-panel-page">
      <div className="page-header">
        <h2>Manage System Permissions</h2>
        <p>Configure system-level permissions and security settings</p>
      </div>
      
      <div className="page-content">
        <div className="page-section">
          <h3>System Settings</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Setting</th>
                <th>Description</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API Access</td>
                <td>Allow external API calls</td>
                <td>Enabled</td>
                <td><span className="status-badge active">Active</span></td>
                <td><button className="action-button">Edit</button></td>
              </tr>
              <tr>
                <td>Session Timeout</td>
                <td>Auto logout after inactivity</td>
                <td>30 minutes</td>
                <td><span className="status-badge active">Active</span></td>
                <td><button className="action-button">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageSystemPermissions
