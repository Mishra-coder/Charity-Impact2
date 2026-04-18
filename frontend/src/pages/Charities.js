import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { FiHeart, FiRefreshCcw, FiShield, FiActivity } from 'react-icons/fi';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [charitiesResponse, contributionsResponse] = await Promise.all([
        api.get('/charities'),
        api.get('/charities/contributions')
      ]);
      setCharities(charitiesResponse.data.data);
      setContributions(contributionsResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  const handleDonate = async (charityId) => {
    const amount = window.prompt('Enter donation amount (£):', '10');
    if (!amount || isNaN(amount)) return;

    try {
      const response = await api.post('/charities/donate', { charityId, amount: parseFloat(amount) });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      alert('Failed to initiate donation');
    }
  };

  const mockCharities = [
    { id: 1, name: 'Red Cross Global', desc: 'Providing emergency assistance, disaster relief, and health education across international borders.', type: 'red' },
    { id: 2, name: 'Solar Grid Initiative', desc: 'Deploying renewable energy infrastructure to underprivileged rural communities globally.', type: 'orange' },
    { id: 3, name: 'Ocean Cleanse', desc: 'Advanced architectural solutions for large-scale plastic extraction from the world\'s oceans.', type: 'blue' },
  ];

  const displayCharities = charities.length > 0 ? charities : mockCharities;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <h1 className="hero-title">Charity Heavy Network</h1>
          <p className="hero-subtitle">SOVEREIGN IMPACT • GLOBAL AUDITED PARTNERS</p>
          <p className="hero-desc-tiny" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', maxWidth: '700px', marginTop: '12px' }}>
            Your performance generates sovereign impact. Review your contributions and connect with our global network of audited high-impact partners.
          </p>
        </header>

        <div className="network-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          <div className="network-stat-card" style={{ background: 'var(--color-card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div className="network-stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>TOTAL CONTRIBUTED</div>
            <div className="network-stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#FFF' }}>£0.00</div>
            <div className="network-stat-sub" style={{ fontSize: '10px', color: '#10B981', marginTop: '8px' }}>
              <FiActivity /> Pending Cycle Sync
            </div>
          </div>
          <div className="network-stat-card" style={{ background: 'var(--color-card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div className="network-stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>ACTIVE SYNCS</div>
            <div className="network-stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#FFF' }}>0</div>
            <div className="network-stat-sub" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>No connected accounts.</div>
          </div>
          <div className="network-stat-card" style={{ background: 'var(--color-card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <div className="network-stat-label" style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>NETWORK PARTNERS</div>
            <div className="network-stat-value" style={{ fontSize: '28px', fontWeight: '900', color: '#FFF' }}>{displayCharities.length}</div>
            <div className="network-stat-sub" style={{ fontSize: '10px', color: '#FAC441', marginTop: '8px' }}>Authorize a partner below.</div>
          </div>
        </div>

        <section style={{ marginTop: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="section-label-bold" style={{ fontSize: '20px' }}>Global Partner Network</h2>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
              {displayCharities.length} VERIFIED ENTITIES
            </div>
          </div>

          <div className="charity-card-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {displayCharities.map((charity) => (
              <div key={charity.id} className={`charity-item-lux ${charity.type === 'red' ? 'charity-card-red' : charity.type === 'orange' ? 'charity-card-orange' : 'charity-card-blue'}`} style={{ background: 'var(--color-card)', borderRadius: '24px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ padding: '32px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <FiHeart style={{ color: charity.type === 'red' ? '#ef4444' : charity.type === 'orange' ? '#f97316' : '#3b82f6' }}/>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '99px' }}>VERIFIED</span>
                   </div>
                   <h3 className="node-title" style={{ fontSize: '22px', marginBottom: '12px' }}>{charity.name}</h3>
                   <p className="node-desc" style={{ marginBottom: '32px', fontSize: '14px', lineHeight: '1.6', color: 'var(--color-muted)' }}>{charity.description || charity.desc}</p>
                   <button 
                     className="btn-boost" 
                     style={{ width: '100%', padding: '16px' }}
                     onClick={() => handleDonate(charity.id)}
                   >
                     AUTHORIZE SUPPORT
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '80px' }}>
          <h2 className="section-label-bold" style={{ fontSize: '20px', marginBottom: '32px' }}>Contribution Transparency Ledger</h2>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '60px', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
            <div style={{ fontSize: '32px', color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }}>
              <FiRefreshCcw />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No Transactions Detected</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 24px' }}>Your contribution ledger is currently empty. Sync your performance data to begin generating verifiable impact.</p>
            <button className="btn-add-gold" style={{ background: 'transparent', border: '1px solid #2D6A4F', color: '#10b981', padding: '12px 32px' }}>DOWNLOAD AUDIT PROTOCOL</button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Charities;
