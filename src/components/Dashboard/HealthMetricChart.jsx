import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

function HealthMetricChart({ healthMetric }) {
  const healthPercent = Number.parseInt(healthMetric?.value || '68', 10)
  const pieData = [
    { name: 'Healthy', value: healthPercent, color: '#2563eb' },
    { name: 'Watch', value: Math.max(100 - healthPercent, 0), color: '#38bdf8' },
  ]

  return (
    <div className="chart-card">
      <p className="eyebrow">{healthMetric?.label || 'Operational Health'}</p>
      <div className="chart-visual">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={48} outerRadius={74} paddingAngle={2}>
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-swatch">
        <span>{healthMetric?.status || 'Stable'}</span>
        <strong>{healthMetric?.detail || '68% healthy'}</strong>
      </div>
    </div>
  )
}

export default HealthMetricChart
