import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiCheck } from 'react-icons/fi';
import './Dashboard.css';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [planType, setPlanType] = useState('monthly');
  const [charityId, setCharityId] = useState('');
  const [charityPercentage, setCharityPercentage] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, charRes] = await Promise.all([
        api.get('/subscriptions/me'),
        api.get('/charities')
      ]);
      setSubscription(subRes.data.data);
      setCharities(charRes.data.data);
      if (charRes.data.data.length > 0) {
        setCharityId(charRes.data.data[0].id);
      }
    } catch (error) {
      setSubscription(null);
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/subscriptions', {
        planType,
        charityId,
        charityPercentage: parseFloat(charityPercentage)
      });
      setShowModal(false);
      fetchData();
      alert('Subscription created successfully!');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await api.post('/subscriptions/cancel');
      fetchData();
      alert('Subscription cancelled');
    } catch (error) {
      alert('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  const monthlyPrice = 100;
  const yearlyPrice = 1000;
  const selectedPrice = planType === 'monthly' ? monthlyPrice : yearlyPrice;
  const charityAmount = (selectedPrice * charityPercentage) / 100;

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Subscription</h1>

        {subscription ? (
          <div className="dashboard-section">
            <h2 className="section-title">Current Subscription</h2>
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Plan</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', textTransform: 'capitalize' }}>
                    {subscription.plan_type}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', textTransform: 'capitalize', color: '#16a34a' }}>
                    {subscription.status}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Amount</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a472a' }}>
                  ${subscription.amount}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Renewal Date</div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {format(new Date(subscription.renewal_date), 'MMMM dd, yyyy')}
                </div>
              </div>
              {subscription.status === 'active' && (
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '10px 20px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '8px',
                    fontWeight: '600',
                    marginTop: '8px'
                  }}
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="dashboard-section" style={{ marginBottom: '32px' }}>
              <h2 className="section-title">Choose Your Plan</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{
                  padding: '24px',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px'
                }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Monthly</h3>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a472a', marginBottom: '16px' }}>
                    ${monthlyPrice}<span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/month</span>
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>Track unlimited scores</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>Enter monthly draws</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>Support charities</span>
                    </li>
                  </ul>
                </div>

                <div style={{
                  padding: '24px',
                  background: 'white',
                  border: '2px solid #1a472a',
                  borderRadius: '12px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    padding: '4px 12px',
                    background: '#1a472a',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Save 17%
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Yearly</h3>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a472a', marginBottom: '16px' }}>
                    ${yearlyPrice}<span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/year</span>
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>Track unlimited scores</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>Enter monthly draws</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>Support charities</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FiCheck style={{ color: '#16a34a' }} />
                      <span>2 months free</span>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
                style={{ marginTop: '24px', width: '100%', padding: '14px' }}
              >
                Subscribe Now
              </button>
            </div>
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Complete Subscription</h2>
              
              <form onSubmit={handleSubscribe}>
                <div className="form-group">
                  <label>Plan Type</label>
                  <select value={planType} onChange={(e) => setPlanType(e.target.value)} style={{
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    width: '100%'
                  }}>
                    <option value="monthly">Monthly - ${monthlyPrice}</option>
                    <option value="yearly">Yearly - ${yearlyPrice}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Charity</label>
                  <select value={charityId} onChange={(e) => setCharityId(e.target.value)} style={{
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    width: '100%'
                  }}>
                    {charities.map(charity => (
                      <option key={charity.id} value={charity.id}>{charity.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Charity Contribution ({charityPercentage}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={charityPercentage}
                    onChange={(e) => setCharityPercentage(e.target.value)}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                    ${charityAmount.toFixed(2)} will go to charity
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1 }}>
                    {submitting ? 'Processing...' : 'Subscribe'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 12px;
          padding: 32px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>
    </Layout>
  );
};

export default Subscription;
