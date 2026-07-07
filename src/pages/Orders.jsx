import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { updateOrder } from '../services/api'
import '../styles/table.css'
import '../styles/index.css'

const Orders = () => {
  const { orders, loading, refetch } = useData()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Debug API data - check the shape of what's coming back
  useEffect(() => {
    console.log('Orders Data:', orders)
    if (orders?.length > 0) {
      console.log('First order shape:', orders[0])
    }
  }, [orders])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, {
        status: newStatus
      })

      refetch()
    } catch (error) {
      console.error(
        'Failed to update order status:',
        error
      )
    }
  }

  const statusCounts = {
    All: orders.length,

    Pending: orders.filter(
      (o) => o.status === 'Pending'
    ).length,

    Processing: orders.filter(
      (o) => o.status === 'Processing'
    ).length,

    Shipped: orders.filter(
      (o) => o.status === 'Shipped'
    ).length,

    Delivered: orders.filter(
      (o) => o.status === 'Delivered'
    ).length,

    Cancelled: orders.filter(
      (o) => o.status === 'Cancelled'
    ).length
  }

  const filteredOrders = orders.filter((order) => {
    // FIX: customerName is a direct field on the order, not order.userId.name
    const customerName = order.customerName || ''

    // FIX: backend uses "orderId", not "_id"
    const orderIdValue = String(order.orderId ?? '')

    const matchesSearch =
      customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||

      orderIdValue
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      order.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
    Card: '💳 Card',
    Cash: '💵 Cash'
  }

  if (loading)
    return (
      <div className="card">
        Loading...
      </div>
    )

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">
          Orders
        </h1>

        <p className="page-subtitle">
          Track and update customer
          orders in real time.
        </p>
      </div>

      <div className="card">

        <div className="status-tabs">
          {[
            'All',
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
          ].map((status) => (
            <button
              key={status}
              className={`status-tab ${
                statusFilter === status
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setStatusFilter(status)
              }
            >
              {status}

              <span className="count-badge">
                  {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>

        <div className="table-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by customer or order id..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              className="form-input"
            />
          </div>
        </div>

        <div className="table-responsive">
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

              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: 'center',
                      padding: '2rem'
                    }}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (

                filteredOrders.map((order) => {

                  // FIX: items live directly on the order, not order.transactions[0].items_purchased
                  const items = order.items || []

                  // FIX: total is order.totalAmount, not transaction.total_spent
                  const total = order.totalAmount || 0

                  return (
                    <tr key={order.orderId}>

                      <td className="order-id">
                        #{order.orderId}
                      </td>

                      <td>
                        {order.customerName ||
                          'Unknown'}
                      </td>

                      <td>
                        {items.length}
                      </td>

                      <td>
                        ₹{total}
                      </td>

                      <td>
                        <span className="payment-method">
                          {
                            paymentMethods[
                              order.paymentMethod
                            ]
                          ||
                            order.paymentMethod
                          ||
                            '—'}
                        </span>
                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : '—'}
                      </td>

                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              statusColors[
                                order.status
                              ]
                                ? statusColors[
                                    order.status
                                  ] + '20'
                                : '#e9ecef',

                            color:
                              statusColors[
                                order.status
                              ] ||
                              '#6c757d'
                          }}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.orderId,
                              e.target.value
                            )
                          }
                          className="form-select form-select-sm"
                        >
                          {[
                            'Pending',
                            'Processing',
                            'Shipped',
                            'Delivered',
                            'Cancelled'
                          ].map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
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
  )
}

export default Orders