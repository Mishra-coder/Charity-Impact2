import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import './Dashboard.css';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [charitiesResponse, contributionsResponse, statsResponse] = await Promise.all([
        api.get('/charities'),
        api.get('/charities/contributions'),
        api.get('/charities/stats')
      ]);
      setCharities(charitiesResponse.data.data);
      setContributions(contributionsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading charities...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Charities</h1>

        {stats && (
          <div className="dashboard-section" style={{ marginBottom: '24px', background: '#f0fdf4', border: '1px solid #86efac' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#16a34a', fontSize: '16px', fontWeight: '600' }}>
              Your Impact
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#16a34a' }}>Total Contributed</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#15803d' }}>
                  ${stats.totalContributed || 0}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#16a34a' }}>Contributions Made</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#15803d' }}>
                  {stats.contributionCount || 0}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#16a34a' }}>Charities Supported</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#15803d' }}>
                  {stats.charitiesSupported || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-section">
          <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Featured Charities</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {charities.map(charity => (
              <div
                key={charity.id}
                style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'start'
                }}
              >
                {charity.logo_url && (
                  <img
                    src={charity.logo_url}
                    alt={charity.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
                    {charity.name}
                  </h3>
                  <p style={{ color: '#6b7280', margin: '0 0 12px 0', fontSize: '14px' }}>
                    {charity.description}
                  </p>
                  {charity.website_url && (
                    <a
                      href={charity.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2563eb',
                        fontSize: '14px',
                        fontWeight: '500',
                        textDecoration: 'none'
                      }}
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {contributions.length > 0 && (
          <div className="dashboard-section" style={{ marginTop: '24px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>My Contribution History</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Charity</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Percentage</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map(contribution => (
                    <tr key={contribution.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', color: '#6b7280' }}>
                        {new Date(contribution.contribution_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {contribution.charities?.logo_url && (
                            <img
                              src={contribution.charities.logo_url}
                              alt={contribution.charities.name}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          <span style={{ fontWeight: '500' }}>
                            {contribution.charities?.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          background: '#f3f4f6',
                          color: '#374151'
                        }}>
                          {contribution.percentage}%
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: '700', color: '#16a34a', fontSize: '16px' }}>
                          ${contribution.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {contributions.length === 0 && (
          <div className="dashboard-section" style={{ marginTop: '24px', textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0' }}>
              You haven't made any contributions yet.
            </p>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
              Subscribe to a plan to start supporting charities!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Charities;
