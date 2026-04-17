import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { FiHeart } from 'react-icons/fi';
import './Dashboard.css';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [charitiesRes, contributionsRes] = await Promise.all([
        api.get('/charities'),
        api.get('/charities/contributions')
      ]);
      setCharities(charitiesRes.data.data);
      setContributions(contributionsRes.data.data);
    } catch (error) {
      setCharities([]);
      setContributions([]);
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

  const totalContributed = contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Charities</h1>

        <div className="stat-card" style={{ marginBottom: '32px' }}>
          <div className="stat-icon" style={{ background: '#fce7f3' }}>
            <FiHeart style={{ color: '#ec4899' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Contributed</div>
            <div className="stat-value">${totalContributed.toFixed(2)}</div>
          </div>
        </div>

        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2 className="section-title">Available Charities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {charities.map((charity) => (
              <div key={charity.id} style={{
                padding: '20px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fce7f3',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <FiHeart style={{ fontSize: '24px', color: '#ec4899' }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  {charity.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  {charity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">My Contributions</h2>
          {contributions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contributions.map((contribution) => (
                <div key={contribution.id} style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      {contribution.charities.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {contribution.percentage}% of subscription
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a472a' }}>
                    ${parseFloat(contribution.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No contributions yet</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Charities;
