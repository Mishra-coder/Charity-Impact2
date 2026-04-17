import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { format } from 'date-fns';
import '../Dashboard.css';

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
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Winner Verifications</h1>

        <div className="dashboard-section">
          {verifications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {verifications.map((verification) => (
                <div key={verification.id} style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        {verification.users.full_name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {verification.users.email}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      height: 'fit-content',
                      background: verification.status === 'approved' ? '#dcfce7' : verification.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                      color: verification.status === 'approved' ? '#16a34a' : verification.status === 'rejected' ? '#dc2626' : '#f59e0b'
                    }}>
                      {verification.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Draw</div>
                    <div style={{ fontSize: '15px', fontWeight: '500' }}>
                      {verification.draws.draw_type} - {format(new Date(verification.draws.draw_date), 'MMM dd, yyyy')}
                    </div>
                    <div style={{ fontSize: '14px', color: '#1a472a', fontWeight: '600', marginTop: '4px' }}>
                      Prize: ${verification.draws.total_prize_pool}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Screenshot</div>
                    <a
                      href={verification.screenshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: '#dbeafe',
                        color: '#2563eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      View Screenshot
                    </a>
                  </div>

                  {verification.admin_notes && (
                    <div style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Admin Notes</div>
                      <div style={{ fontSize: '14px' }}>{verification.admin_notes}</div>
                    </div>
                  )}

                  {verification.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleVerify(verification.id, 'approved')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: '#dcfce7',
                          color: '#16a34a',
                          borderRadius: '8px',
                          fontWeight: '600'
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(verification.id, 'rejected')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '8px',
                          fontWeight: '600'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No verifications found</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminVerifications;
