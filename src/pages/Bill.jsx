import { useState } from 'react'
import { useData } from '../context/DataContext'
import { deleteBill } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/bills.css'
import '../styles/index.css'

const Bills = () => {
  const { bills, loading, refetch } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [customerFilter, setCustomerFilter] = useState('All')
  const navigate = useNavigate()

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteBill(billId)
        refetch()
      } catch (error) {
        console.error('Failed to delete bill:', error)
        alert('Failed to delete bill')
      }
    }
  }

  const handleEditBill = (bill) => {
    navigate(`/bills/generate/${bill.id}`, { state: { bill } })
  }

  const handleViewBill = (bill) => {
    navigate('/bills/generate', { state: { bill, previewOnly: true } })
  }

  const getCustomers = () => {
    const customerSet = new Set()
    bills.forEach(bill => {
      if (bill.customerName) customerSet.add(bill.customerName)
    })
    return ['All', ...Array.from(customerSet)]
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch =
      bill.billNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = !dateFilter || bill.date?.includes(dateFilter)
    const matchesCustomer = customerFilter === 'All' || bill.customerName === customerFilter
    return matchesSearch && matchesDate && matchesCustomer
  })

  if (loading) return <div className="card">Loading bills...</div>

  return (
    <div className="bills-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bills Management</h1>
          <p className="page-subtitle">{bills.length} bills in the system.</p>
        </div>
        <div className="page-actions">
          <Link to="/bills/generate" className="btn btn-primary">+ Generate New Bill</Link>
        </div>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="filters-section" style={{ marginBottom: '24px' }}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Search Bills</label>
              <input type="text" placeholder="Search by bill number, customer, or table..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Customer</label>
              <select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} className="form-select">
                {getCustomers().map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bills-table-container">
          <table className="bills-table">
            <thead>
              <tr>
                <th>Bill #</th><th>Date</th><th>Time</th><th>Customer</th><th>Table</th><th>Cashier</th><th>Items</th><th>Total</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.date}</td>
                    <td>{bill.time}</td>
                    <td>{bill.customerName || 'Walk-in'}</td>
                    <td>{bill.tableNumber}</td>
                    <td>{bill.cashier}</td>
                    <td>{bill.items?.length || 0}</td>
                    <td>₹{bill.total?.toFixed(2)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-outline btn-sm" onClick={() => handleViewBill(bill)}>View</button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleEditBill(bill)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBill(bill.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No bills found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {filteredBills.length > 0 && (
          <div className="bills-summary" style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--light-color)', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Summary</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Showing {filteredBills.length} of {bills.length} bills</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Total Amount: ₹{filteredBills.reduce((sum, bill) => sum + (bill.total || 0), 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bills