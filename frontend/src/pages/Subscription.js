import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { FiCheck, FiDownload } from 'react-icons/fi';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/subscriptions/me');
      setSubscription(response.data.data);
    } catch (error) {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await api.post('/subscriptions/cancel');
      fetchData();
    } catch (error) {
      console.error('Failed to cancel subscription');
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

  const mockInvoices = [
    { id: 1, date: 'Sep 24, 2024', desc: 'Explorer Monthly Subscription', amount: '£100.00', status: 'PAID' },
    { id: 2, date: 'Aug 24, 2024', desc: 'Explorer Monthly Subscription', amount: '£100.00', status: 'PAID' },
    { id: 3, date: 'Jul 24, 2024', desc: 'Explorer Monthly Subscription', amount: '£100.00', status: 'PAID' },
  ];

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <h1 className="hero-title">Charity Heavy Membership</h1>
          <p className="hero-subtitle">SOVEREIGN ACCESS • IMPACT CONTROL CENTER</p>
          <p className="hero-desc-tiny" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', maxWidth: '600px', marginTop: '12px' }}>
            Manage your impact tier and subscription settings. Your contribution fuels global change through sovereign sport excellence.
          </p>
        </header>

        <div className="current-plan-card-lux" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '32px', marginBottom: '48px', borderLeft: '4px solid #2D6A4F' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span className="stat-label-tiny" style={{ color: '#FAC441', fontSize: '10px', fontWeight: '800' }}>CURRENT PLAN</span>
                <span className="status-pill-active" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: '700' }}>ACTIVE</span>
              </div>
              <h2 className="node-title" style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>Explorer Monthly</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Next billing date: <span style={{ color: '#FFFFFF', fontWeight: '700' }}>October 24, 2024</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '40px', fontWeight: '900', color: '#FFFFFF' }}>£100<span style={{ fontSize: '20px', opacity: 0.4 }}>/mo</span></div>
              <button onClick={handleCancel} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', cursor: 'pointer', marginTop: '12px', fontSize: '12px' }}>Cancel Subscription</button>
            </div>
          </div>
        </div>

        <div className="billing-section-lux">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="section-label-bold" style={{ fontSize: '20px' }}>Available Plans</h2>
            <div className="plan-toggle-container" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', display: 'flex' }}>
              <button className={`plan-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: billingCycle === 'monthly' ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#FFF', cursor: 'pointer', fontSize: '12px' }} onClick={() => setBillingCycle('monthly')}>Monthly</button>
              <button className={`plan-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: billingCycle === 'yearly' ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#FFF', cursor: 'pointer', fontSize: '12px' }} onClick={() => setBillingCycle('yearly')}>Yearly</button>
            </div>
          </div>

          <div className="membership-grid-lux">
            <div className="plan-card-lux" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '32px', opacity: 0.8 }}>
              <h3 className="node-title" style={{ fontSize: '22px', marginBottom: '12px' }}>Explorer</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px' }}>Essential impact and dashboard access.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheck style={{ color: '#2D6A4F' }}/> Standard Dashboard Metrics</li>
                <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheck style={{ color: '#2D6A4F' }}/> Digital Impact Certificate</li>
                <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheck style={{ color: '#2D6A4F' }}/> Monthly Impact Report</li>
              </ul>
              <button className="btn-boost" style={{ width: '100%', cursor: 'default', opacity: 0.5 }}>Current Plan</button>
            </div>

            <div className="plan-card-lux" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #FAC441', borderRadius: '24px', padding: '32px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#FAC441', color: '#000', padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: '900' }}>ELITE</span>
              <h3 className="node-title" style={{ fontSize: '22px', marginBottom: '12px' }}>Annual Champion</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '24px' }}>Premium access with maximum leverage.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheck style={{ color: '#FAC441' }}/> All Explorer Features</li>
                <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheck style={{ color: '#FAC441' }}/> Priority Championship Entry</li>
                <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiCheck style={{ color: '#FAC441' }}/> VIP Impact Lounge Access</li>
              </ul>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '32px', fontWeight: '900' }}>£1,000</span>
                <span style={{ opacity: 0.4, fontSize: '16px' }}>/year</span>
              </div>
              <button className="btn-add-gold" style={{ width: '100%' }}>Upgrade to Annual</button>
            </div>
          </div>
        </div>

        <div className="billing-section-lux" style={{ marginTop: '80px' }}>
          <h2 className="section-label-bold" style={{ fontSize: '24px', marginBottom: '24px' }}>Billing History</h2>
          <table className="billing-table-lux">
            <thead>
              <tr>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>INVOICE</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map(inv => (
                <tr key={inv.id} className="billing-row-lux">
                  <td style={{ color: 'rgba(255,255,255,0.7)' }}>{inv.date}</td>
                  <td style={{ fontWeight: '800' }}>{inv.desc}</td>
                  <td>{inv.amount}</td>
                  <td>
                    <span className="status-paid-lux">PAID</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <FiDownload style={{ cursor: 'pointer', fontSize: '18px', opacity: 0.6 }}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href="#" className="view-all-link">VIEW ALL INVOICES</a>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
