import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiCheck, 
  FiStar, 
  FiZap,
  FiArrowRight
} from 'react-icons/fi';

const Subscription = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      await api.get('/subscriptions/plans');
    } catch (error) {
       console.error('Plan sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-lux">INITIALIZING SYSTEM...</div>;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <p className="hero-subtitle">SOVEREIGN ACCESS</p>
          <h1 className="hero-title">Charity Heavy Membership</h1>
          <p className="hero-desc-tiny">
            Choose your impact tier. Every plan is synchronized with global charity distribution networks and premium reward pools.
          </p>
        </header>

        <div className="membership-grid-lux">
          {/* IMPACT PLAN */}
          <div className="sub-card-active">
            <div className="sub-card-padding">
              <div className="sub-header-row">
                <FiZap style={{ fontSize: '32px', color: '#10B981' }} /> {/* Allowed for specific icons if color is unique */}
                <div>
                  <h3 className="node-title">Impact Tier</h3>
                  <p className="hero-subtitle">STANDARD PROTOCOL</p>
                </div>
              </div>
              
              <div className="sub-pricing-row">
                <span className="sub-val-main">£12</span>
                <span className="sub-val-unit"> / month</span>
              </div>

              <ul className="sub-features-list">
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-success" />
                  <span className="sub-feature-text">Access to Standard Pools</span>
                </li>
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-success" />
                  <span className="sub-feature-text">Weekly Performance Sync</span>
                </li>
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-success" />
                  <span className="sub-feature-text">Standard Charity Support</span>
                </li>
              </ul>

              <button className="btn-outline-sub">
                CURRENT PLAN
              </button>
            </div>
          </div>

          {/* ELITE PLAN */}
          <div className="sub-card-active sub-card-elite">
            <div className="sub-card-padding">
              <div className="sub-header-row">
                <FiStar style={{ fontSize: '32px', color: '#FAC441' }} />
                <div>
                  <h3 className="node-title">Elite Tier</h3>
                  <p className="hero-subtitle">PRESTIGE ACCESS</p>
                </div>
              </div>

              <div className="sub-pricing-row">
                <span className="sub-val-main">£35</span>
                <span className="sub-val-unit"> / month</span>
              </div>

              <ul className="sub-features-list">
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-warning" />
                  <span className="sub-feature-text bold">Priority Draw Entry</span>
                </li>
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-warning" />
                  <span className="sub-feature-text">Exclusive Charity Events</span>
                </li>
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-warning" />
                  <span className="sub-feature-text">Direct Impact Dashboard</span>
                </li>
                <li className="sub-feature-item">
                  <FiCheck className="sub-feature-icon text-warning" />
                  <span className="sub-feature-text">VIP Support Line</span>
                </li>
              </ul>

              <button className="btn-add-gold btn-full-width">
                UPGRADE TO ELITE <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
