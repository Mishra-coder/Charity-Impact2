import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiUsers, FiDollarSign, FiAward, FiHeart, FiAlertCircle } from 'react-icons/fi';
import '../Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>
              <FiUsers style={{ color: '#2563eb' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{stats?.totalUsers || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <FiUsers style={{ color: '#16a34a' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Active Subscribers</div>
              <div className="stat-value">{stats?.activeSubscribers || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <FiDollarSign style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Prize Pool</div>
              <div className="stat-value">${stats?.totalPrizePool?.toFixed(2) || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fce7f3' }}>
              <FiHeart style={{ color: '#ec4899' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Charity Contributions</div>
              <div className="stat-value">${stats?.totalCharityAmount?.toFixed(2) || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fee2e2' }}>
              <FiAlertCircle style={{ color: '#dc2626' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending Verifications</div>
              <div className="stat-value">{stats?.pendingVerifications || 0}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <a href="/admin/users" className="btn-primary" style={{ textAlign: 'center' }}>
              Manage Users
            </a>
            <a href="/admin/draws" className="btn-primary" style={{ textAlign: 'center' }}>
              Manage Draws
            </a>
            <a href="/admin/verifications" className="btn-primary" style={{ textAlign: 'center' }}>
              Verify Winners
            </a>
            <a href="/admin/charities" className="btn-primary" style={{ textAlign: 'center' }}>
              Manage Charities
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
