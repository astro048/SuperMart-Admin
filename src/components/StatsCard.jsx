import '../styles/dashboard.css'

const StatsCard = ({ title, value, change, icon, color }) => {
  return (
    <div className="stats-card">
      
      <div className="stats-info">
        <span className="stats-title">{title}</span>
        <div className="stats-value-row">
          <span className="stats-value">{value}</span>
          <span className="stats-change" style={{ color: change.startsWith('+') ? '#28a745' : '#dc3545' }}>
            {change}
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatsCard