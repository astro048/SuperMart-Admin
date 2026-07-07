import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { updateUser, deleteUser } from '../services/api'
import '../styles/table.css'
import '../styles/index.css'

const Users = () => {
  const { users, loading, refetch } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return
    
    try {
      for (const userId of selectedUsers) {
        if (action === 'activate') {
          await updateUser(userId, { status: 'Active' })
        } else if (action === 'block') {
          await updateUser(userId, { status: 'Blocked' })
        } else if (action === 'delete') {
          await deleteUser(userId)
        }
      }
      refetch()
      setSelectedUsers([])
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusColors = {
    Active: '#28a745',
    Blocked: '#dc3545',
    Pending: '#ffc107'
  }

  if (loading) return <div className="card">Loading...</div>

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Manage customer accounts and perform bulk actions.</p>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="filter-and-actions">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending">Pending</option>
            </select>
            <span className="selected-count">{selectedUsers.length} selected</span>
            <button 
              className="btn btn-success btn-sm"
              onClick={() => handleBulkAction('activate')}
            >
              Activate
            </button>
            <button 
              className="btn btn-warning btn-sm"
              onClick={() => handleBulkAction('block')}
            >
              Block
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ORDERS</th>
                <th>JOINED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ backgroundColor: user.avatarColor || '#3498db' }}>
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.orders || 0}</td>
                  <td>{new Date(user.joined).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className="badge"
                      style={{ 
                        backgroundColor: statusColors[user.status] ? statusColors[user.status] + '20' : '#e9ecef',
                        color: statusColors[user.status] || '#6c757d'
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users