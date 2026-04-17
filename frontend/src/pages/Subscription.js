import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import './Dashboard.css';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [formData, setFormData] = useState({
    planType: 'monthly',
    charityId: '',
    charityPercentage: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subResponse, charResponse] = await Promise.all([
        api.get('/subscriptions/me'),
        api.get('/charities')
      ]);
      setSubscription(subResponse.data.data);
      setCharities(charResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!formData.charityId) {
      alert('Please select a charity');
      return;
    }

    try {
      await api.post('/subscriptions', formData);
      setShowSubscribeForm(false);
      fetchData();
      alert('Subscription created successfully!');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to create subscription');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await api.post('/subscriptions/cancel');
      fetchData();
      alert('Subscription cancelled successfully');
    } catch (error) {
      alert('Failed to cancel subscription');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        <h1 className="page-title">Subscription</h1>

        {subscription ? (
          <div>
            <div className="dashboard-section">
              <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Current Plan</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                      {subscription.plan_type === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                    </p>
                    <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
                      ${subscription.amount} / {subscription.plan_type === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                  <span style={{
                    padding: '6px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    background: subscription.status === 'active' ? '#dcfce7' : '#fee2e2',
                    color: subscription.status === 'active' ? '#16a34a' : '#dc2626'
                  }}>
                    {subscription.status}
                  </span>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Start Date:</span>
                      <span style={{ fontWeight: '500' }}>
                        {new Date(subscription.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>End Date:</span>
                      <span style={{ fontWeight: '500' }}>
                        {new Date(subscription.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Next Renewal:</span>
                      <span style={{ fontWeight: '500' }}>
                        {new Date(subscription.renewal_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {subscription.status === 'active' && (
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '10px 20px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      marginTop: '16px'
                    }}
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {!showSubscribeForm ? (
              <div className="dashboard-section">
                <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Choose Your Plan</h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Subscribe to track your scores, enter prize draws, and support charities.
                </p>

                <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                  <div style={{
                    padding: '24px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setFormData({ ...formData, planType: 'monthly' });
                    setShowSubscribeForm(true);
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Monthly Plan</h3>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#2563eb', margin: '0 0 8px 0' }}>
                      $100<span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/month</span>
                    </p>
                    <ul style={{ color: '#6b7280', paddingLeft: '20px', margin: '16px 0 0 0' }}>
                      <li>Track unlimited golf scores</li>
                      <li>Enter monthly prize draws</li>
                      <li>Support your chosen charity</li>
                      <li>Access to all features</li>
                    </ul>
                  </div>

                  <div style={{
                    padding: '24px',
                    border: '2px solid #2563eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => {
                    setFormData({ ...formData, planType: 'yearly' });
                    setShowSubscribeForm(true);
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '24px',
                      padding: '4px 12px',
                      background: '#2563eb',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Save $200
                    </span>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Yearly Plan</h3>
                    <p style={{ fontSize: '32px', fontWeight: '700', color: '#2563eb', margin: '0 0 8px 0' }}>
                      $1000<span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/year</span>
                    </p>
                    <ul style={{ color: '#6b7280', paddingLeft: '20px', margin: '16px 0 0 0' }}>
                      <li>All monthly plan features</li>
                      <li>2 months free</li>
                      <li>Priority support</li>
                      <li>Exclusive yearly draws</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dashboard-section">
                <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Complete Your Subscription</h2>
                <form onSubmit={handleSubscribe}>
                  <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Selected Plan
                      </label>
                      <input
                        type="text"
                        value={formData.planType === 'monthly' ? 'Monthly - $100/month' : 'Yearly - $1000/year'}
                        disabled
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          background: '#f9fafb'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Choose Charity
                      </label>
                      <select
                        name="charityId"
                        value={formData.charityId}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Select a charity</option>
                        {charities.map(charity => (
                          <option key={charity.id} value={charity.id}>
                            {charity.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Charity Contribution ({formData.charityPercentage}%)
                      </label>
                      <input
                        type="range"
                        name="charityPercentage"
                        value={formData.charityPercentage}
                        onChange={handleChange}
                        min="10"
                        max="100"
                        step="5"
                        style={{ width: '100%' }}
                      />
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0 0 0' }}>
                        ${((formData.planType === 'monthly' ? 100 : 1000) * formData.charityPercentage / 100).toFixed(2)} will go to your chosen charity
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Subscribe Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSubscribeForm(false)}
                        style={{
                          padding: '12px 20px',
                          background: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Subscription;
