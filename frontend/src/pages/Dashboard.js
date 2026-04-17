import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { FiTrendingUp, FiAward, FiHeart, FiCreditCard } from 'react-icons/fi';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/users/dashboard');
      setData(response.data.data);
    } catch (error) {
      setData(null);
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

  const hasSubscription = data?.subscription !== null;

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>
              <FiTrendingUp style={{ color: '#2563eb' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Scores</div>
              <div className="stat-value">{data?.scores?.length || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7' }}>
              <FiAward style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Draw Entries</div>
              <div className="stat-value">{data?.drawEntries?.length || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fce7f3' }}>
              <FiHeart style={{ color: '#ec4899' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Charity Contributions</div>
              <div className="stat-value">{data?.contributions?.length || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#dcfce7' }}>
              <FiCreditCard style={{ color: '#16a34a' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Subscription</div>
              <div className="stat-value">{hasSubscription ? 'Active' : 'None'}</div>
            </div>
          </div>
        </div>

        {!hasSubscription && (
          <div className="alert alert-warning">
            <h3>No Active Subscription</h3>
            <p>Subscribe to start tracking scores and entering draws</p>
            <a href="/subscription" className="btn-primary">Subscribe Now</a>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2 className="section-title">Recent Scores</h2>
            {data?.scores?.length > 0 ? (
              <div className="scores-list">
                {data.scores.map((score) => (
                  <div key={score.id} className="score-item">
                    <div className="score-date">
                      {format(new Date(score.score_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="score-value">{score.score_value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No scores yet</div>
            )}
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Recent Draw Entries</h2>
            {data?.drawEntries?.length > 0 ? (
              <div className="draws-list">
                {data.drawEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="draw-item">
                    <div className="draw-info">
                      <div className="draw-type">{entry.draws.draw_type}</div>
                      <div className="draw-date">
                        {format(new Date(entry.draws.draw_date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className={`draw-status ${entry.draws.status}`}>
                      {entry.draws.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No draw entries yet</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
