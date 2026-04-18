import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiAward, 
  FiZap, 
  FiShield, 
  FiActivity,
  FiTrendingUp,
  FiClock,
  FiArrowRight
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Data sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-lux">INITIALIZING SYSTEM...</div>;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <p className="hero-subtitle">SOVEREIGN OVERVIEW</p>
          <h1 className="hero-title">Charity Heavy Commander</h1>
          <p className="hero-desc-tiny">
            Welcome back to the command center. Your global impact and synchronization metrics are active and updated.
          </p>
        </header>

        <div className="stats-grid">
          <div className="stat-card-gold">
            <FiAward className="stat-icon-gold" />
            <div className="hero-subtitle">CURRENT RANKING</div>
            <div className="stat-value-large">Commander</div>
            <p className="stat-desc-small">GLOBAL IMPACT TIER 4</p>
          </div>

          <div className="stat-card-gold">
            <FiZap className="stat-icon-gold" />
            <div className="hero-subtitle">POTENTIAL REWARDS</div>
            <div className="stat-value-large">£24,500.00</div>
            <p className="stat-desc-small">SYNCED WITH ACTIVE CHAMPIONSHIPS</p>
          </div>

          <div className="stat-card-gold">
            <FiShield className="stat-icon-gold" />
            <div className="hero-subtitle">HANDICAP INDEX</div>
            <div className="stat-value-large">{stats?.user?.handicap || '14.2'}</div>
            <p className="stat-desc-small">OFFICIAL VERIFIED RATING</p>
          </div>

          <div className="stat-card-gold">
            <FiActivity className="stat-icon-gold" />
            <div className="hero-subtitle">IMPACT MOMENTUM</div>
            <div className="stat-value-large">Active</div>
            <p className="stat-desc-small">SYNCED ACROSS ALL CHANNELS</p>
          </div>
        </div>

        <div className="dashboard-main-grid">
          <div className="main-col-left">
            <div className="repository-card">
              <div className="momentum-header">
                <h3 className="node-title">Sovereign Performance</h3>
                <span className="hero-subtitle">LIVE TRACKING</span>
              </div>
              
              <div className="chart-placeholder-lux">
                <div className="chart-bar-container">
                  {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                    <div key={i} className={`chart-bar-lux ${i === 6 ? 'active' : ''}`} style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>

              <div className="chart-legend-lux">
                <div className="momentum-legend">
                  <div className="stat-mini-val">74.2</div>
                  <div className="stat-mini-label">AVG STABLEFORD</div>
                </div>
                <div className="momentum-legend">
                  <div className="stat-mini-val" style={{ color: '#10B981' }}>+12%</div>
                  <div className="stat-mini-label">MONTHLY GROWTH</div>
                </div>
              </div>
            </div>
          </div>

          <div className="main-col-right">
            <div className="repository-card">
              <h3 className="node-title" style={{ marginBottom: '24px' }}>Active Synchronization</h3>
              <div className="sync-list">
                <div className="sync-item">
                  <div className="sync-label-group">
                    <FiTrendingUp className="logo-gold" />
                    <span className="sync-label-text">Network Synchronization</span>
                  </div>
                  <span className="sync-status-tag sync-status-optimal">OPTIMAL</span>
                </div>
                <div className="sync-item">
                  <div className="sync-label-group">
                    <FiShield className="logo-gold" />
                    <span className="sync-label-text">Handicap Verification</span>
                  </div>
                  <span className="sync-status-tag sync-status-verified">VERIFIED</span>
                </div>
                <div className="sync-item">
                  <div className="sync-label-group">
                    <FiClock className="logo-gold" />
                    <span className="sync-label-text">Reward Distribution</span>
                  </div>
                  <span className="sync-status-tag sync-status-pending">PENDING</span>
                </div>
              </div>
              <button className="btn-add-gold btn-full-width">
                AUDIT FULL NETWORK <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
