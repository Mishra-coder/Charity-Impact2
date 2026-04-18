import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FiUploadCloud, FiCheckCircle, FiShield } from 'react-icons/fi';

const WinnerVerification = () => {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <Layout>
      <div className="verification-container">
        <h1 className="hero-title">Charity Heavy Authentication</h1>
        
        {!submitted ? (
          <div className="repository-card">
            <div className="alert-warning-lux">
              <FiShield className="alert-icon-gold" />
              <div>
                <h3 className="alert-title-gold">Verification Required</h3>
                <p className="alert-desc-muted">
                  To maintain the integrity of Charity Heavy championships, all winners must upload a certified screenshot of their performance from the official golf platform.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="upload-zone-premium">
                <input 
                  type="file" 
                  id="proof" 
                  hidden 
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="proof" style={{ cursor: 'pointer' }}>
                  <FiUploadCloud style={{ fontSize: '48px', color: '#FAC441', marginBottom: '16px' }} />
                  <h3 className="empty-title">
                    {file ? file.name : 'Select Verification Screenshot'}
                  </h3>
                  <p className="empty-desc">
                    PNG, JPG or PDF up to 10MB
                  </p>
                </label>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h4 className="guidelines-title">Submission Guidelines</h4>
                <ul className="guidelines-list">
                  <li>The screenshot must show your full name and date of the round.</li>
                  <li>Stableford points must match your recorded score exactly.</li>
                  <li>Altered or low-resolution images will be rejected by auditors.</li>
                </ul>
              </div>

              <button 
                type="submit" 
                className="btn-add-round-full"
                disabled={!file || loading}
              >
                {loading ? 'SECURING CONNECTION...' : 'SUBMIT PROOF FOR AUDIT'}
              </button>
            </form>
          </div>
        ) : (
          <div className="repository-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
            <FiCheckCircle style={{ fontSize: '80px', color: '#10b981', marginBottom: '24px' }} />
            <h2 className="empty-title">Submission Successful</h2>
            <p className="empty-desc">
              Your verification proof has been queued for administrative review. You will receive a notification once your rewards are authorized.
            </p>
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn-add-gold" onClick={() => window.location.href='/dashboard'}>DASHBOARD</button>
              <button className="btn-boost" onClick={() => window.location.href='/draws'}>CHAMPIONSHIPS</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WinnerVerification;
