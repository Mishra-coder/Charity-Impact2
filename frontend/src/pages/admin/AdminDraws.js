import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiPlus, FiX } from 'react-icons/fi';

const AdminDraws = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [drawType, setDrawType] = useState('5-match');
  const [drawDate, setDrawDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const response = await api.get('/draws');
      setDraws(response.data.data);
    } catch (error) {
      setDraws([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/draws', {
        drawType,
        drawDate
      });
      setShowModal(false);
      setDrawDate('');
      fetchDraws();
      alert('Draw created successfully');
    } catch (error) {
      alert('Failed to create draw');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExecute = async (drawId) => {
    if (!window.confirm('Are you sure you want to execute this draw?')) {
      return;
    }
    try {
      const response = await api.post(`/admin/draws/${drawId}/execute`);
      alert(`Draw executed! Winning numbers: ${response.data.data.winningNumbers.join(', ')}`);
      fetchDraws();
    } catch (error) {
      alert('Failed to execute draw');
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
        <header className="championship-header-lux">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className="hero-title" style={{ margin: 0 }}>Manage Draws</h1>
            <p className="hero-subtitle">CHAMPIONSHIP SCHEDULER • POOL AUTHORITY</p>
          </div>
          <button className="btn-add-gold" onClick={() => setShowModal(true)}>
            <FiPlus style={{ marginRight: '8px' }} />
            CREATE DRAW
          </button>
        </header>

        <div className="momentum-card">
          <table className="champs-table">
            <thead>
              <tr>
                <th>TYPE</th>
                <th>DRAW DATE</th>
                <th>PRIZE POOL</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw.id} className="champs-row">
                  <td style={{ padding: '20px', fontWeight: '800' }}>{draw.draw_type?.toUpperCase()}</td>
                  <td style={{ padding: '20px', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(draw.draw_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px', fontWeight: '900', color: '#FAC441' }}>
                    ${draw.total_prize_pool}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div className="status-glow-badge">
                      <div className={`status-dot ${draw.status === 'completed' ? 'green' : 'yellow'}`} style={{ background: draw.status === 'completed' ? '#10b981' : '#FAC441' }}></div>
                      {draw.status?.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    {draw.status === 'pending' && (
                      <button
                        onClick={() => handleExecute(draw.id)}
                        className="btn-boost"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        EXECUTE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)} style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}>
            <div className="repository-card" style={{ maxWidth: '480px', width: '90%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '24px', cursor: 'pointer' }}>
                <FiX />
              </button>
              
              <h2 className="node-title" style={{ marginBottom: '32px', fontSize: '24px' }}>Create New Draw</h2>
              
              <form onSubmit={handleCreate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="stat-label-tiny">DRAW TYPE</label>
                    <select value={drawType} onChange={(e) => setDrawType(e.target.value)} className="auth-input-lux" style={{
                      padding: '16px',
                      background: '#0A0F0D',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      width: '100%'
                    }}>
                      <option value="5-match">5-Match (40% pool)</option>
                      <option value="4-match">4-Match (35% pool)</option>
                      <option value="3-match">3-Match (25% pool)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label className="stat-label-tiny">DRAW DATE</label>
                    <input
                      type="date"
                      value={drawDate}
                      onChange={(e) => setDrawDate(e.target.value)}
                      required
                      className="auth-input-lux"
                      style={{
                        padding: '16px',
                        background: '#0A0F0D',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        width: '100%'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                    <button type="submit" className="btn-add-gold" disabled={submitting} style={{ flex: 1 }}>
                      {submitting ? 'CREATING...' : 'CREATE DRAW'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDraws;
