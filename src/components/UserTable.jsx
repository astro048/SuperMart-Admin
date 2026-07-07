import { useState } from 'react'

const UserTable = ({ users, loading, onSelectAll, onSelectUser, selectedUsers, onBulkAction }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

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

  if (loading) return <div>Loading...</div>

  return (
    <div className="user-table-container">
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
            onClick={() => onBulkAction('activate')}
          >
            Activate
          </button>
          <button 
            className="btn btn-warning btn-sm"
            onClick={() => onBulkAction('block')}
          >
            Block
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onBulkAction('delete')}
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
                  onChange={onSelectAll}
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
                    onChange={() => onSelectUser(user.id)}
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
  )
}

export default UserTable