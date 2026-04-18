import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiUploadCloud, 
  FiCheckCircle, 
  FiAlertCircle,
  FiArrowRight,
  FiShield
} from 'react-icons/fi';

const WinnerVerification = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('proof', file);

    try {
      await api.post('/draws/verify-winner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <p className="hero-subtitle">AUTHENTICATION PROTOCOL</p>
          <h1 className="hero-title">Winner Verification</h1>
          <p className="hero-desc-tiny">
            Please provide your official scorecard or verified round proof to scale your reward distribution. All documents are synchronized with our transparency ledger.
          </p>
        </header>

        {!success ? (
          <div className="repository-card">
            <h2 className="node-title mb-24">Upload Proof of Performance</h2>
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message text-error mb-16">{error}</div>}
              
              <div className="chart-placeholder-lux p-0">
                <input
                  type="file"
                  id="proof"
                  onChange={handleFileChange}
                  className="hidden-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="proof" className="cursor-pointer flex flex-column align-center p-20">
                  <FiUploadCloud className="icon-upload-large" />
                  <p className="node-title" style={{ fontSize: '18px' }}>
                    {file ? file.name : 'Select Official Document'}
                  </p>
                  <p className="node-desc mt-12">PDF, JPG or PNG (MAX 5MB)</p>
                </label>
              </div>

              <div className="mt-32">
                <div className="sync-item">
                  <div className="sync-label-group">
                    <FiShield className="logo-gold" />
                    <span className="sync-label-text">Encryption Protocol Active</span>
                  </div>
                  <span className="sync-status-tag sync-status-optimal">OPTIMAL</span>
                </div>
              </div>

              <button type="submit" className="btn-add-gold btn-full-width" disabled={loading || !file}>
                {loading ? 'SYNCING DOCUMENT...' : 'SUBMIT FOR VERIFICATION'}
              </button>
            </form>
          </div>
        ) : (
          <div className="repository-card repository-card-center">
            <FiCheckCircle className="icon-success-large" />
            <h2 className="hero-title">Verification Received</h2>
            <p className="node-desc mt-12">
              Our audit nodes are now verifying your performance data. Rewards will be synchronized upon successful validation.
            </p>
            <div className="mt-40 flex justify-center gap-16">
              <button className="btn-add-gold" onClick={() => window.location.href = '/dashboard'}>
                RETURN TO COMMANDER <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WinnerVerification;
