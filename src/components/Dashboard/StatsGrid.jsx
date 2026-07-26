function StatsGrid({ stats }) {
  return (
    <>
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <p>{stat.label}</p>
          <h3>{stat.value}</h3>
          <span>{stat.trend}</span>
        </div>
      ))}
    </>
  )
}

export default StatsGrid
