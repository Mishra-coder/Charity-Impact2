import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiAward, 
  FiClock, 
  FiUsers, 
  FiTrendingUp,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';

const Draws = () => {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      await api.get('/admin/stats');
      // Mocking pools data based on the original screenshot
      setPools([
        { id: 1, type: 'CURRENT JACKPOT', amount: '£185,420.00', status: 'LIVE', players: '4,202', time: '14h 22m' },
        { id: 2, type: 'CHARITY POOL', amount: '£42,900.00', status: 'SYNCED', players: '12,800', time: 'Ongoing' },
        { id: 3, type: 'ELITE DRAW', amount: '£250,000.00', status: 'PENDING', players: '150/500', time: '2d 08h' },
      ]);
    } catch (error) {
      console.error('Failed to sync pools');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-lux">INITIALIZING SYSTEM...</div>;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <p className="hero-subtitle">SOVEREIGN POOLS</p>
          <h1 className="hero-title">Charity Heavy Pools</h1>
          <p className="hero-desc-tiny">
            Participate in synchronized impact championships. Every entry scales the global reward and charity distribution network.
          </p>
        </header>

        <div className="pools-grid">
          {pools.map(pool => (
            <div key={pool.id} className="pool-card-luxury">
              <span className="hero-subtitle">{pool.type}</span>
              <span className="pool-amount-large">{pool.amount}</span>
              <span className="ps-label">PROJECTED DISTRIBUTIONS</span>
              
              <div className="pool-stats-row">
                <div className="pool-stat-col">
                  <span className="ps-val">{pool.players}</span>
                  <span className="ps-label">ENTRANTS</span>
                </div>
                <div className="pool-stat-col">
                  <span className="ps-val">{pool.time}</span>
                  <span className="ps-label">REMAINING</span>
                </div>
              </div>

              <button className="btn-add-gold btn-full-width">
                ENTER POOL NOW
              </button>
            </div>
          ))}
        </div>

        <section className="section-margin-top">
          <div className="momentum-header">
            <h2 className="node-title">Active Championships</h2>
            <span className="status-glow-badge"><div className="status-dot green"></div> NETWORK ACTIVE</span>
          </div>

          <div className="repository-card" style={{ padding: '0' }}> {/* Table padding: 0 is fine since it's functional layout */}
            <table className="champs-table">
              <thead>
                <tr>
                  <th>TOURNAMENT</th>
                  <th>POOL SCALE</th>
                  <th>ENTRIES</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'The Sovereign Invitational', pool: '£120,000', entries: '1,200', status: 'Active' },
                  { name: 'Impact Masters Round 4', pool: '£45,000', entries: '850', status: 'Paused' },
                  { name: 'Global Charity Open', pool: '£250,000', entries: '4,500', status: 'Active' }
                ].map((champ, i) => (
                  <tr key={i} className="champs-row">
                    <td>{champ.name}</td>
                    <td>{champ.pool}</td>
                    <td>{champ.entries}</td>
                    <td>
                      <span className={champ.status === 'Active' ? 'text-success' : 'text-warning'}>{champ.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section-margin-bottom">
          <h2 className="node-title" style={{ marginBottom: '32px' }}>Recent Winners</h2>
          <div className="winners-grid-alt">
            {[
              { name: 'Alex Thorne', prize: '£42,000.00' },
              { name: 'Elena Rodri', prize: '£12,500.00' },
              { name: 'Marcus S.', prize: '£8,900.00' },
              { name: 'Sarah J.', prize: '£25,000.00' }
            ].map((winner, i) => (
              <div key={i} className="winner-card-mini">
                <div className="winner-avatar-ring"><div></div></div>
                <div className="winner-info-mini">
                  <span className="winner-name-mini">{winner.name}</span>
                  <span className="winner-prize-mini">{winner.prize}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Draws;
