import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiHeart, 
  FiCreditCard, 
  FiClock, 
  FiEdit3,
  FiZap
} from 'react-icons/fi';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ dd: '00', hh: '00', mm: '00', ss: '00' });

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(() => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 3); 
      targetDate.setHours(20, 0, 0, 0);
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
      } else {
        const dd = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hh = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mm = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const ss = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({
          dd: dd.toString().padStart(2, '0'),
          hh: hh.toString().padStart(2, '0'),
          mm: mm.toString().padStart(2, '0'),
          ss: ss.toString().padStart(2, '0')
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/users/dashboard');
      setData(response.data.data);
    } catch (error) {
      setData(null);
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

  const scores = data?.scores || [];
  const entries = data?.drawEntries || [];
  const stats = data?.stats;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <h1 className="hero-title">Charity Heavy Commander</h1>
          <p className="hero-subtitle">SOVEREIGN TIER ACCESS • GLOBAL RANKING: #422</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card-gold">
            <div className="stat-icon-wrapper"><FiTrendingUp /></div>
            <span className="stat-meta-tag">PEAK</span>
            <span className="stat-label-small">PERFORMANCE PEAK</span>
            <div className="stat-value-large">74.2 <span className="stat-value-unit">pts</span></div>
          </div>

          <div className="stat-card-gold">
            <div className="stat-icon-wrapper"><FiUsers /></div>
            <span className="stat-meta-tag">LIVE</span>
            <span className="stat-label-small">POOL PARTICIPATION</span>
            <div className="stat-value-large">{entries.length || 12} <span className="stat-value-unit">active</span></div>
          </div>

          <div className="stat-card-gold">
            <div className="stat-icon-wrapper"><FiHeart /></div>
            <span className="stat-meta-tag">GLOBAL</span>
            <span className="stat-label-small">CHARITY REACH</span>
            <div className="stat-value-large">£{stats?.totalDonated || '4.2k'} <span className="stat-value-unit">impact</span></div>
          </div>

          <div className="stat-card-gold">
            <div className="stat-icon-wrapper"><FiCreditCard /></div>
            <span className="stat-meta-tag">PRO</span>
            <span className="stat-label-small">SUBSCRIPTION</span>
            <div className="stat-value-large">Gold <span className="stat-value-unit">tier</span></div>
          </div>
        </div>

        <div className="dashboard-main-grid">
          <div className="repository-card">
            <div className="card-header-row">
              <div>
                <h2 className="card-title">Score Entry Repository</h2>
                <p className="card-subtitle-meta">SEASON 2024</p>
              </div>
            </div>

            <div className="empty-repository">
              <div className="empty-circle-btn">
                <FiEdit3 />
              </div>
              <h3 className="empty-title">No score entries detected</h3>
              <p className="empty-desc">Your competitive repository is currently vacant. Initiate your performance logging to sync with the global leaderboard.</p>
              <button className="btn-add-gold" onClick={() => window.location.href='/scores'}>ADD SCORE</button>
            </div>
          </div>

          <div className="draw-card">
            <div className="draw-title-icon">
              <FiZap /> NEXT SOVEREIGN DRAW
            </div>

            <div className="next-draw-timer">
              <div className="timer-block">
                <span className="timer-val">{timeLeft.dd}</span>
                <span className="timer-label">DAYS</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-block">
                <span className="timer-val">{timeLeft.hh}</span>
                <span className="timer-label">HRS</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-block">
                <span className="timer-val">{timeLeft.mm}</span>
                <span className="timer-label">MIN</span>
              </div>
              <span className="timer-sep">:</span>
              <div className="timer-block">
                <span className="timer-val">{timeLeft.ss}</span>
                <span className="timer-label">SEC</span>
              </div>
            </div>

            <div className="prize-tiers">
              <div className="prize-row">
                <span className="tier-name">Platinum Winner</span>
                <span className="tier-val">£2,500.00</span>
              </div>
              <div className="prize-row">
                <span className="tier-name">Charity Pool Split</span>
                <span className="tier-val">£12,400.00</span>
              </div>
            </div>

            <button className="btn-boost" onClick={() => window.location.href='/draws'}>BOOST ENTRIES</button>
          </div>
        </div>

        <section className="impact-flow-section">
          <h2 className="flow-title">Live Impact Flow</h2>
          <div className="flow-cards">
            <div className="flow-card green">
              <div className="flow-thumb">
                <div style={{ background: '#10B981', width: '100%', height: '100%' }}></div>
              </div>
              <div className="flow-content">
                <span className="flow-proj">REFORESTATION PROJECT</span>
                <span className="flow-stat">240 Trees Planted in Amazon Basin</span>
              </div>
            </div>

            <div className="flow-card blue">
              <div className="flow-thumb">
                <div style={{ background: '#3B82F6', width: '100%', height: '100%' }}></div>
              </div>
              <div className="flow-content">
                <span className="flow-proj">CLEAN WATER INITIATIVE</span>
                <span className="flow-stat">1,200 Liters Filtered for Urban Oasis</span>
              </div>
            </div>

            <div className="flow-card gold">
              <div className="flow-thumb">
                <div style={{ background: '#FAC441', width: '100%', height: '100%' }}></div>
              </div>
              <div className="flow-content">
                <span className="flow-proj">IMPACT GOLD GRANT</span>
                <span className="flow-stat">$15k Milestone Reached for Education</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
