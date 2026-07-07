import { useState } from 'react'
import { updateOrder } from '../services/api'

const OrderTable = ({ orders, loading, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)
  const [editStatus, setEditStatus] = useState('')

  const handleStatusChange = (orderId, currentStatus) => {
    setEditingId(orderId)
    setEditStatus(currentStatus)
  }

  const saveStatus = async (orderId) => {
    try {
      await updateOrder(orderId, { status: editStatus })
      setEditingId(null)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const statusColors = {
    Delivered: '#28a745',
    Pending: '#ffc107',
    Shipped: '#17a2b8',
    Processing: '#6c757d',
    Cancelled: '#dc3545'
  }

  const paymentMethods = {
    UPI: '💳 UPI',
    COD: '💰 COD',
    Card: '💳 Card'
  }

  if (loading) return <div>Loading...</div>

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ORDER ID</th>
          <th>CUSTOMER</th>
          <th>ITEMS</th>
          <th>TOTAL</th>
          <th>PAYMENT</th>
          <th>DATE</th>
          <th>STATUS</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="order-id">#{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.items}</td>
            <td>₹{order.total}</td>
            <td>{paymentMethods[order.payment] || order.payment}</td>
            <td>{new Date(order.date).toLocaleDateString()}</td>
            <td>
              {editingId === order.id ? (
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="form-select form-select-sm"
                  autoFocus
                >
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <span 
                  className="badge"
                  style={{ 
                    backgroundColor: statusColors[order.status] ? statusColors[order.status] + '20' : '#e9ecef',
                    color: statusColors[order.status] || '#6c757d'
                  }}
                >
                  {order.status}
                </span>
              )}
            </td>
            <td>
              {editingId === order.id ? (
                <>
                  <button className="action-btn edit" onClick={() => saveStatus(order.id)}>
                    ✓
                  </button>
                  <button className="action-btn delete" onClick={cancelEdit}>
                    ✕
                  </button>
                </>
              ) : (
                <button 
                  className="action-btn edit"
                  onClick={() => handleStatusChange(order.id, order.status)}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OrderTable