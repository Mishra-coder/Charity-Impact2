import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiCheck, FiX, FiShield, FiFileText } from 'react-icons/fi';

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
      console.error('Failed to fetch audit requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.put(`/admin/verifications/${id}`, { status });
      fetchVerifications();
    } catch (error) {
      alert('Action failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-32">
        <div className="step-bar active" style={{ width: '60px' }}></div>
      </div>
    );
  }

  return (
    <div className="admin-verifications-container">
      <div className="momentum-header">
        <h2 className="node-title">Audit Protocol Requests</h2>
        <span className="status-glow-badge"><div className="status-dot green"></div> SYNC ACTIVE</span>
      </div>

      <div className="charity-card-wrapper" style={{ gridTemplateColumns: '1fr' }}>
        {verifications.map((verification) => (
          <div key={verification.id} className="repository-card admin-verif-card-padding">
            <div className="admin-verif-header">
              <div className="flex-column gap-4">
                <h3 className="node-title" style={{ fontSize: '20px' }}>{verification.users?.full_name}</h3>
                <p className="hero-subtitle" style={{ fontSize: '14px', textAlign: 'left' }}>{verification.users?.email}</p>
              </div>
              <div className="flex align-center gap-12">
                <div className={`status-dot ${verification.status === 'approved' ? 'status-dot-approved' : verification.status === 'rejected' ? 'status-dot-rejected' : 'status-dot-pending'}`} 
                     style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                <span className="sync-status-tag">{verification.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="admin-verif-divider">
              <div className="flex justify-between align-center">
                <div className="flex align-center gap-16">
                  <div className="charity-icon-box bg-info-subtle"><FiFileText /></div>
                  <div>
                    <p className="ps-label">PROOF DOCUMENT</p>
                    <a href={verification.proof_url} target="_blank" rel="noopener noreferrer" className="auth-footer-link" style={{ fontSize: '14px' }}>
                      Audit-Proof-Node-{verification.id.slice(0,8)}.pdf
                    </a>
                  </div>
                </div>

                {verification.status === 'pending' && (
                  <div className="flex gap-12">
                    <button 
                      onClick={() => handleAction(verification.id, 'rejected')}
                      className="btn-impact-view" 
                      style={{ width: 'auto', padding: '12px 24px', color: '#ef4444' }}
                    >
                      <FiX /> REJECT
                    </button>
                    <button 
                      onClick={() => handleAction(verification.id, 'approved')}
                      className="btn-add-gold" 
                      style={{ padding: '12px 24px' }}
                    >
                      <FiCheck /> APPROVE
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {verifications.length === 0 && (
          <div className="repository-card repository-card-center">
            <FiShield className="icon-success-large" style={{ opacity: 0.1 }} />
            <p className="node-desc">No pending audit requests detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerifications;
