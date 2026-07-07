import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-1">
          <h1>Super</h1>
          <div className="sidebar-header-2">
            <p>Mart</p>
          </div>
        </div>
        <div>
           <h1>Admin</h1>
        </div>

       
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="section-title">OVERVIEW</span>
          <NavLink to="/" className="nav-link" activeclassname="active">
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="section-title">MANAGEMENT</span>
          <NavLink to="/users" className="nav-link" activeclassname="active">
            <span className="icon">👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink to="/orders" className="nav-link" activeclassname="active">
            <span className="icon">📦</span>
            <span>Orders</span>
          </NavLink>
          <NavLink to="/products" className="nav-link" activeclassname="active">
            <span className="icon">🛒</span>
            <span>Products</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <span className="section-title">ADD PRODUCT</span>
          <NavLink
            to="/products/details"
            className="nav-link"
            activeclassname="active"
          >
            <span className="icon">📝</span>
            <span>Product Details</span>
          </NavLink>
          <NavLink
            to="/products/information"
            className="nav-link"
            activeclassname="active"
          >
            <span className="icon">ℹ️</span>
            <span>Product Information</span>
          </NavLink>
          <NavLink to="/bills" className="nav-link" activeclassname="active">
            <span className="icon">💰</span>
            <span>Generate Bill</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <button
            className="user-account"
            onClick={handleLogout}
            title="Click to logout"
          >
            <span className="icon">👤</span>
            <span className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">Logout</span>
            </span>
          </button>
        ) : (
          <button className="user-account" onClick={() => setShowModal(true)}>
            <span className="icon">👤</span>
            <span className="user-info">
              <span className="user-name">Not logged in</span>
              <span className="user-role">Click to login</span>
            </span>
          </button>
        )}
      </div>

      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </aside>
  );
};

export default Sidebar;
