import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navItems = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/users", label: "Users", icon: "👥" },
    { to: "/orders", label: "Orders", icon: "📦" },
    { to: "/products", label: "Products", icon: "🛒" },
    { to: "/products/details", label: "Product Details", icon: "📝" },
    { to: "/products/information", label: "Product Information", icon: "ℹ️" },
    { to: "/bills", label: "Generate Bill", icon: "💰" },
  ];

  const renderNavLinks = (className = "nav-link") =>
    navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) => `${className}${isActive ? " active" : ""}`}
        onClick={closeMenu}
      >
        <span className="icon">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    ));

  return (
    <>
      <aside className={`sidebar ${isMenuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-1">
            <h1>Super</h1>
            <div className="sidebar-header-2">
              <p>Mart</p>
            </div>
          </div>
          <div className="sidebar-brand-text">
            <h1>Admin</h1>
          </div>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">{renderNavLinks()}</nav>

        {/* <div className="sidebar-footer">
          {user ? (
            <button className="user-account" onClick={handleLogout} title="Click to logout">
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
        </div> */}
      </aside>

      <div className={`sidebar-overlay ${isMenuOpen ? "active" : ""}`} onClick={closeMenu} />
      <div className={`sidebar-mobile ${isMenuOpen ? "active" : ""}`}>
        <nav className="sidebar-nav">{renderNavLinks()}</nav>
      </div>

      {showModal && (
        <LoginModal onClose={() => setShowModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default Sidebar;
