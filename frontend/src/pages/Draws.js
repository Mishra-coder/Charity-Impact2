import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiAward, 
  FiZap, 
  FiTrophy, 
  FiClock,
  FiChevronRight
} from 'react-icons/fi';

const Draws = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ dd: '00', hh: '00', mm: '00', ss: '00' });

  useEffect(() => {
    fetchDraws();
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

  const fetchDraws = async () => {
    try {
      const response = await api.get('/draws');
      setDraws(response.data.data);
    } catch (err) {
      console.error('Failed to fetch draws');
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

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="dashboard-hero">
          <h1 className="hero-title">Charity Heavy Pools</h1>
          <p className="hero-subtitle">SOVEREIGN CHAMPIONSHIPS • IMPACT GENERATION</p>
        </header>

        <div className="pools-grid">
          <div className="pool-card-luxury">
            <span className="pool-type-tag">PLATINUM POOL</span>
            <span className="pool-amount-large">£2,500.00</span>
            <span className="pool-subtitle-muted">MAIN EVENT CHAMPIONSHIP</span>
            <div className="pool-stats-row">
              <div className="pool-stat-col">
                <span className="ps-val">1.2k</span>
                <span className="ps-label">PLAYERS</span>
              </div>
              <div className="pool-stat-col">
                <span className="ps-val">4.8k</span>
                <span className="ps-label">ENTRIES</span>
              </div>
            </div>
            <button className="btn-record" style={{ width: '100%', justifyContent: 'center' }}>ENTER POOL</button>
          </div>

          <div className="pool-card-luxury">
            <span className="pool-type-tag">GOLD POOL</span>
            <span className="pool-amount-large">£1,000.00</span>
            <span className="pool-subtitle-muted">WEEKLY IMPACT SURGE</span>
            <div className="pool-stats-row">
              <div className="pool-stat-col">
                <span className="ps-val">842</span>
                <span className="ps-label">PLAYERS</span>
              </div>
              <div className="pool-stat-col">
                <span className="ps-val">2.1k</span>
                <span className="ps-label">ENTRIES</span>
              </div>
            </div>
            <button className="btn-record" style={{ width: '100%', justifyContent: 'center' }}>ENTER POOL</button>
          </div>

          <div className="pool-card-luxury">
            <span className="pool-type-tag">CHARITY POOL</span>
            <span className="pool-amount-large">£12,400.00</span>
            <span className="pool-subtitle-muted">GLOBAL IMPACT CONTRIBUTION</span>
            <div className="pool-stats-row">
              <div className="pool-stat-col">
                <span className="ps-val">10%</span>
                <span className="ps-label">YIELD</span>
              </div>
              <div className="pool-stat-col">
                <span className="ps-val">5.4k</span>
                <span className="ps-label">TOTAL IMPACT</span>
              </div>
            </div>
            <button className="btn-record" style={{ width: '100%', justifyContent: 'center' }}>VIEW IMPACT</button>
          </div>
        </div>

        <div className="draw-card" style={{ maxWidth: '600px', margin: '0 auto 80px auto', textAlign: 'center' }}>
          <div className="draw-title-icon" style={{ justifyContent: 'center' }}>
            <FiClock /> NEXT DRAW IN
          </div>
          <div className="next-draw-timer" style={{ justifyContent: 'center', gap: '32px' }}>
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
        </div>

        <section style={{ marginBottom: '80px' }}>
          <h2 className="section-label-bold">Open & Recent Championships</h2>
          <div className="table-responsive-wrapper">
            <table className="champs-table">
              <thead>
                <tr>
                  <th>CHAMPIONSHIP NAME</th>
                  <th>POOL SIZE</th>
                  <th>ENTRIES</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {draws.map(draw => (
                  <tr key={draw.id} className="champs-row">
                    <td>{draw.draw_name || 'Weekly Impact Championship'}</td>
                    <td className="text-gold">£{draw.prize_pool || '1,000.00'}</td>
                    <td>{draw.total_entries || '842'}</td>
                    <td>
                      <div className="status-glow-badge">
                        <div className={`status-dot ${draw.status === 'open' ? 'green' : 'gray'}`}></div>
                        {draw.status?.toUpperCase() || 'OPEN'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}><FiChevronRight /></td>
                  </tr>
                ))}
                {draws.length === 0 && (
                  <tr className="champs-row">
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)' }}>
                      No championship records currently synchronized.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="section-label-bold">Recent Winners</h2>
          <div className="winners-grid-alt">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="winner-card-mini">
                <div className="winner-avatar-ring">
                  <div></div>
                </div>
                <div className="winner-info-mini">
                  <span className="winner-name-mini">James Wilson</span>
                  <span className="winner-prize-mini">£2,500.00 WON</span>
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
