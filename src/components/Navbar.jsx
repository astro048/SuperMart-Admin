import { useState } from 'react'
import '../styles/navbar.css'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  } 
  
  return (
    <header className="navbar">
      <div className="navbar-left">
        <form onSubmit={handleSearch} className="search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="navbar-right">
        <div className="notification">🔔</div>
        <div className="user-profile">
          <span className="user-avatar">A</span>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar