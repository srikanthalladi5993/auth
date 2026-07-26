import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function ShiftTrendChart({ shiftTrend }) {
  const barData = (shiftTrend || [55, 72, 68, 81, 76]).map((value, index) => ({
    shift: ['A', 'B', 'C', 'D', 'E'][index],
    value,
  }))

  return (
    <div className="chart-card">
      <p className="eyebrow">Trend by Shift</p>
      <div className="chart-visual">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="shift" tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ShiftTrendChart
