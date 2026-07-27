function ActionPanels({ notificationPanel, subNodePanel }) {
  return (
    <div className="city-action-row">
      <div className="city-form-card">
        <h3>{notificationPanel?.title || 'Create Notification'}</h3>
        <input placeholder={notificationPanel?.placeholder || 'Send User Notifications'} />
        <button type="button">{notificationPanel?.buttonLabel || 'Send Notification'}</button>
      </div>

      <div className="city-form-card">
        <h3>{subNodePanel?.title || 'Create New Sub Node'}</h3>
        <input placeholder={subNodePanel?.placeholder || 'New Subnode Name'} />
        <button type="button">{subNodePanel?.buttonLabel || 'Create new subnode'}</button>
      </div>
    </div>
  )
}

export default ActionPanels
