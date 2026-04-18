import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const AdminVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const response = await api.get('/admin/verifications');
      setVerifications(response.data.data);
    } catch (error) {
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (verificationId, status) => {
    const notes = prompt('Enter admin notes (optional):');
    try {
      await api.put(`/admin/verifications/${verificationId}`, {
        status,
        adminNotes: notes || ''
      });
      fetchVerifications();
      alert('Verification updated successfully');
    } catch (error) {
      alert('Failed to update verification');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="auth-container" style={{ minHeight: '60vh' }}>
          <div className="step-bar active" style={{ width: '60px', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <h1 className="hero-title">Audit Queue</h1>
          <p className="hero-subtitle">WINNER VERIFICATION • ASSET AUTHORIZATION</p>
        </header>

        <div className="charity-card-wrapper" style={{ gridTemplateColumns: '1fr' }}>
          {verifications.length > 0 ? (
            verifications.map((verification) => (
              <div key={verification.id} className="repository-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 className="node-title" style={{ fontSize: '20px' }}>{verification.users?.full_name}</h3>
                    <p className="hero-subtitle" style={{ fontSize: '14px', textAlign: 'left' }}>{verification.users?.email}</p>
                  </div>
                  <div className="status-glow-badge">
                    <div className={`status-dot ${verification.status === 'approved' ? 'green' : verification.status === 'rejected' ? 'red' : 'yellow'}`} 
                         style={{ background: verification.status === 'approved' ? '#10b981' : verification.status === 'rejected' ? '#ef4444' : '#FAC441' }}></div>
                    {verification.status?.toUpperCase()}
                  </div>
                </div>

                <div className="charity-stats-row-lux" style={{ margin: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                   <div>
                      <div className="stat-label-tiny">CHAMPIONSHIP</div>
                      <div className="stat-val-main" style={{ fontSize: '18px' }}>
                        {verification.draws?.draw_type?.toUpperCase()} • {new Date(verification.draws?.draw_date).toLocaleDateString()}
                      </div>
                   </div>
                   <div>
                      <div className="stat-label-tiny">REWARD SIZE</div>
                      <div className="stat-val-main" style={{ fontSize: '24px', color: '#FAC441' }}>${verification.draws?.total_prize_pool}</div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div className="stat-label-tiny" style={{ marginBottom: '12px' }}>VERIFICATION PAYLOAD</div>
                    <a
                      href={verification.screenshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-boost"
                      style={{ textDecoration: 'none', display: 'inline-block' }}
                    >
                      VIEW SCREENSHOT
                    </a>
                  </div>

                  {verification.admin_notes && (
                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <div className="stat-label-tiny" style={{ marginBottom: '12px' }}>ADMINISTRATIVE NOTES</div>
                      <p className="node-desc" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>{verification.admin_notes}</p>
                    </div>
                  )}
                </div>

                {verification.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '16px', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px' }}>
                    <button
                      onClick={() => handleVerify(verification.id, 'approved')}
                      className="btn-add-gold"
                      style={{ flex: 1 }}
                    >
                      AUTHORIZE
                    </button>
                    <button
                      onClick={() => handleVerify(verification.id, 'rejected')}
                      className="btn-boost"
                      style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: '#ef4444' }}
                    >
                      REJECT
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-zone-lux">
              <div className="empty-icon-lux">∅</div>
              <h2 className="empty-title">Queue Synchronized</h2>
              <p className="empty-desc">No pending verifications found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminVerifications;
