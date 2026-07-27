import { useSelector } from 'react-redux'
import { selectSelectedApp, selectSelectedMenu } from '../features/dashboard/dashboardSlice'
import StatsGrid from '../shared/components/StatsGrid'
import HealthMetricChart from '../shared/components/HealthMetricChart'
import ShiftTrendChart from '../shared/components/ShiftTrendChart'
import ActionPanels from '../shared/components/ActionPanels'
import DataTable from '../shared/components/DataTable'

function DashboardView() {
  const selectedApp = useSelector(selectSelectedApp)
  const selectedMenu = useSelector(selectSelectedMenu)

  const tableColumns = selectedApp.tableColumns?.map((col) => col.key) || []

  return (
    <section className="dashboard-view">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{selectedMenu.label}</p>
          <h2>{selectedApp.summary}</h2>
        </div>
        <div className="pill">Live telemetry • {selectedApp.tableRows.length} records</div>
      </div>

      <ActionPanels
        notificationPanel={selectedApp.notificationPanel}
        subNodePanel={selectedApp.subNodePanel}
      />

      <div className="stats-grid">
        <StatsGrid stats={selectedApp.stats} />
        <HealthMetricChart healthMetric={selectedApp.healthMetric} />
        <ShiftTrendChart shiftTrend={selectedApp.shiftTrend} />
      </div>

      <DataTable tableRows={selectedApp.tableRows} columns={tableColumns} />
    </section>
  )
}

export default DashboardView
