import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiHeart, 
  FiGlobe, 
  FiShield, 
  FiPieChart,
  FiArrowUpRight
} from 'react-icons/fi';

const Charities = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      await api.get('/charities');
    } catch (error) {
      console.error('Failed to sync charity network');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-lux">INITIALIZING SYSTEM...</div>;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <p className="hero-subtitle">SOVEREIGN NETWORK</p>
          <h1 className="hero-title">Charity Heavy Network</h1>
          <p className="hero-desc-tiny">
            Our mission is to synchronize professional golf performance with global humanitarian aid. Every synchronization scales these verified impact nodes.
          </p>
        </header>

        <section className="charity-hero-lux">
          <div className="charity-glow-effect"></div>
          <h2 className="node-title">Network Impact Summary</h2>
          <div className="charity-stats-row-lux">
            <div className="charity-stat-card-lux">
              <div className="charity-icon-box bg-success-subtle"><FiGlobe /></div>
              <div>
                <div className="stat-mini-val">14</div>
                <div className="stat-mini-label">GLOBAL NODES</div>
              </div>
            </div>
            <div className="charity-stat-card-lux">
              <div className="charity-icon-box bg-warning-subtle"><FiPieChart /></div>
              <div>
                <div className="stat-mini-val">£1.2M</div>
                <div className="stat-mini-label">TOTAL DISTRIBUTED</div>
              </div>
            </div>
            <div className="charity-stat-card-lux">
              <div className="charity-icon-box bg-info-subtle"><FiShield /></div>
              <div>
                <div className="stat-mini-val">100%</div>
                <div className="stat-mini-label">AUDIT PROTOCOLS</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-margin-top">
          <h2 className="node-title mb-32">Partner Charities</h2>
          <div className="charity-card-wrapper">
            {[
              { name: 'Water Sovereignty', desc: 'Developing verified clean water infrastructure in arid regions.', color: '#3B82F6' },
              { name: 'Global Green Initiative', desc: 'Regenerative environmental projects synchronized with local ecosystems.', color: '#10B981' },
              { name: 'Impact Education', desc: 'Providing advanced educational tools to underserved global communities.', color: '#FAC441' }
            ].map((node, i) => (
              <div key={i} className="charity-item-lux">
                <div className="charity-item-header" style={{ background: node.color, opacity: 0.1 }}></div> {/* Dynamic bg color is fine, but color logic is in JSON */}
                <div className="charity-logo-anchor">
                  <div className="charity-logo-frame">
                    <FiHeart style={{ color: node.color, fontSize: '24px' }} />
                  </div>
                  <FiArrowUpRight className="logo-gold opacity-02" />
                </div>
                <div className="charity-padding">
                  <h3 className="node-title">{node.name}</h3>
                  <p className="node-desc">{node.desc}</p>
                  <button className="btn-impact-view">VIEW IMPACT</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-margin-bottom">
          <h2 className="node-title mb-32">Contribution Transparency Ledger</h2>
          <div className="repository-card p-0">
            <div className="ledger-table-wrap">
              <table className="champs-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>CHARITY NODE</th>
                    <th>DISTRIBUTION</th>
                    <th>PROTOCOL</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Oct 12, 2023', node: 'Water Sovereignty', dist: '£12,400.00', prot: 'Verified' },
                    { date: 'Oct 05, 2023', node: 'Global Green', dist: '£8,900.50', prot: 'Verified' },
                    { date: 'Sep 28, 2023', node: 'Impact Education', dist: '£15,000.00', prot: 'Verified' }
                  ].map((entry, i) => (
                    <tr key={i} className="champs-row">
                      <td>{entry.date}</td>
                      <td>{entry.node}</td>
                      <td className="text-success" style={{ fontWeight: '800' }}>{entry.dist}</td>
                      <td>
                        <span className="badge-protocol">{entry.prot}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Charities;
