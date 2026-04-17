import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiTrendingUp, FiAward, FiCreditCard, FiHeart, FiMenu, FiX, FiLogOut, FiUsers, FiSettings } from 'react-icons/fi';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userLinks = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/scores', icon: FiTrendingUp, label: 'Scores' },
    { path: '/draws', icon: FiAward, label: 'Draws' },
    { path: '/subscription', icon: FiCreditCard, label: 'Subscription' },
    { path: '/charities', icon: FiHeart, label: 'Charities' }
  ];

  const adminLinks = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/draws', icon: FiAward, label: 'Draws' },
    { path: '/admin/verifications', icon: FiSettings, label: 'Verifications' },
    { path: '/admin/charities', icon: FiHeart, label: 'Charities' }
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="layout">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="logo">GolfPro</h1>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
            <div className="user-details">
              <div className="user-name">{user?.fullName}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <header className="header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <div className="header-title">GolfPro</div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;
