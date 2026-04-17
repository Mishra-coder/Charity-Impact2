import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { format } from 'date-fns';
import { FiPlus } from 'react-icons/fi';
import '../Dashboard.css';

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
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="page-title">Manage Draws</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus style={{ marginRight: '8px' }} />
            Create Draw
          </button>
        </div>

        <div className="dashboard-section">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Prize Pool</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {draws.map((draw) => (
                  <tr key={draw.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{draw.draw_type}</td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      {format(new Date(draw.draw_date), 'MMM dd, yyyy')}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1a472a' }}>
                      ${draw.total_prize_pool}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        background: draw.status === 'completed' ? '#dcfce7' : '#fef3c7',
                        color: draw.status === 'completed' ? '#16a34a' : '#f59e0b'
                      }}>
                        {draw.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {draw.status === 'pending' && (
                        <button
                          onClick={() => handleExecute(draw.id)}
                          style={{
                            padding: '6px 16px',
                            background: '#1a472a',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          Execute
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Create New Draw</h2>
              
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Draw Type</label>
                  <select value={drawType} onChange={(e) => setDrawType(e.target.value)} style={{
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '15px',
                    width: '100%'
                  }}>
                    <option value="5-match">5-Match (40% pool)</option>
                    <option value="4-match">4-Match (35% pool)</option>
                    <option value="3-match">3-Match (25% pool)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Draw Date</label>
                  <input
                    type="date"
                    value={drawDate}
                    onChange={(e) => setDrawDate(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1 }}>
                    {submitting ? 'Creating...' : 'Create Draw'}
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

export default AdminDraws;
