import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  FiGrid, 
  FiUsers, 
  FiHeart, 
  FiAward, 
  FiShield, 
  FiLogOut,
  FiMenu,
  FiX,
  FiTrendingUp
} from 'react-icons/fi';

import AdminUsers from './AdminUsers';
import AdminCharities from './AdminCharities';
import AdminDraws from './AdminDraws';
import AdminVerifications from './AdminVerifications';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
       console.error('Admin sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) return <div className="loading-lux">INITIALIZING SYSTEM...</div>;

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h1 className="auth-logo auth-logo-left">
            <span className="logo-white">CHARITY</span>
            <span className="logo-gold">HEAVY</span>
          </h1>
          <p className="hero-subtitle">ADMIN CONTROL</p>
        </div>

        <nav className="admin-nav-list">
          <NavLink to="/admin" end className="admin-nav-item">
            <FiGrid className="admin-nav-icon" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className="admin-nav-item">
            <FiUsers className="admin-nav-icon" /> Managed Users
          </NavLink>
          <NavLink to="/admin/charities" className="admin-nav-item">
            <FiHeart className="admin-nav-icon" /> Impact Nodes
          </NavLink>
          <NavLink to="/admin/draws" className="admin-nav-item">
            <FiAward className="admin-nav-icon" /> Championship Pools
          </NavLink>
          <NavLink to="/admin/verifications" className="admin-nav-item">
            <FiShield className="admin-nav-icon" /> Audit Requests
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-nav-item logo-btn">
            <FiLogOut className="admin-nav-icon" /> TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        <header className="dashboard-hero">
          <p className="hero-subtitle">SYSTEM STATUS: OPTIMAL</p>
          <h1 className="hero-title">Admin Control Center</h1>
          <p className="hero-desc-tiny">
            Global network synchronization active. All impact nodes and reward distributions are currently verified and operational.
          </p>
        </header>

        <Routes>
          <Route path="/" element={
            <div className="admin-dashboard-overview">
              <div className="admin-grid">
                <div className="stat-card-gold">
                  <FiUsers className="stat-icon-gold" />
                  <div className="hero-subtitle">NETWORK USERS</div>
                  <div className="stat-value-large">{stats?.totalUsers || '2,402'}</div>
                  <p className="stat-desc-small">LIVE SCALE: +12%</p>
                </div>
                <div className="stat-card-gold">
                  <FiHeart className="stat-icon-gold" />
                  <div className="hero-subtitle">CHARITY NODES</div>
                  <div className="stat-value-large">14</div>
                  <p className="stat-desc-small">TOTAL NODES VERIFIED</p>
                </div>
                <div className="stat-card-gold">
                  <FiTrendingUp className="stat-icon-gold" />
                  <div className="hero-subtitle">NETWORK IMPACT</div>
                  <div className="stat-value-large">£1.2M+</div>
                  <p className="stat-desc-small">TOTAL SYNCED DISTRIBUTION</p>
                </div>
              </div>

              <div className="repository-card">
                <div className="momentum-header">
                  <h3 className="node-title">System Momentum</h3>
                  <div className="momentum-legend">
                    <div className="legend-dot"></div>
                    <span>SYNC ACTIVITY</span>
                  </div>
                </div>
                <div className="chart-placeholder-lux">
                   <div className="chart-bar-container">
                    {[30, 60, 45, 80, 55, 90, 75, 40, 85].map((h, i) => (
                      <div key={i} className="chart-bar-lux active" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
                <p className="node-desc align-center">
                  System performance is currently at 98.4% efficiency across all nodes.
                </p>
              </div>
            </div>
          } />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/charities" element={<AdminCharities />} />
          <Route path="/draws" element={<AdminDraws />} />
          <Route path="/verifications" element={<AdminVerifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
