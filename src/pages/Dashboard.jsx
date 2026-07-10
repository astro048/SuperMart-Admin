import { useData } from '../context/DataContext'
import StatsCard from '../components/StatsCard'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { users, orders, products, loading } = useData()

  const parseTotal = (total) => {
    if (total == null) return 0
    if (typeof total === 'number') return total
    return parseInt(String(total).replace(/[^0-9]/g, '')) || 0
  }

  const stats = [
    {
      title: 'Total Users',
      value: loading ? '...' : users.length,
      change: '+12% vs last week',
      icon: '👥',
      color: '#3498db'
    },
    {
      title: 'Orders Today',
      value: loading ? '...' : orders.filter(o => o.date && new Date(o.date).toDateString() === new Date().toDateString()).length,
      change: '+8% vs last week',
      icon: '📦',
      color: '#28a745'
    },
    {
      title: 'Products Listed',
      value: loading ? '...' : products.length,
      change: '+3 vs last week',
      icon: '🛒',
      color: '#ffc107'
    },
    {
      title: 'Revenue (₹)',
      value: loading ? '...' : orders.reduce((sum, o) => sum + parseTotal(o.total), 0).toLocaleString(),
      change: '+18% vs last week',
      icon: '💰',
      color: '#e91e63'
    }
  ]

  const recentOrders = orders.slice(0, 4)

  const statusColors = {
    Delivered: '#28a745',
    Pending: '#ffc107',
    Shipped: '#17a2b8',
    Processing: '#6c757d',
    Cancelled: '#dc3545'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, here's what's happening in your store today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="recent-orders">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Orders</h3>
            </div>
            <a href="/orders" className="view-all-btn">View All</a>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>ITEM</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const orderId = order.orderId ?? order.orderId ?? '—'
                    const customerName =
                      typeof order.customer === 'string'
                        ? order.customer
                        : order.customer?.name ?? order.customerName ?? '—'

                    let itemLabel = 'Multiple Items'
                    if (typeof order.items === 'string') {
                      itemLabel = order.items
                    } else if (Array.isArray(order.items)) {
                      itemLabel = order.items[0]?.name || 'Multiple Items'
                    }

                    return (
                      <tr key={orderId}>
                        <td className="order-id">#{orderId}</td>
                        <td className="customer-name">{customerName}</td>
                        <td className="item-name">{itemLabel}</td>
                        <td className="amount">₹{order.total ?? 0}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: statusColors[order.status] ? statusColors[order.status] + '20' : '#e9ecef'
                            }}
                          >
                            {order.status ?? 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
