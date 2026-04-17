import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import './Dashboard.css';

const Draws = () => {
  const [draws, setDraws] = useState([]);
  const [myEntries, setMyEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drawsResponse, entriesResponse] = await Promise.all([
        api.get('/draws'),
        api.get('/draws/my-entries')
      ]);
      setDraws(drawsResponse.data.data);
      setMyEntries(entriesResponse.data.data);
    } catch (error) {
      console.error('Error fetching draws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = async (drawId) => {
    try {
      await api.post(`/draws/enter/${drawId}`);
      fetchData();
      alert('Successfully entered the draw!');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to enter draw');
    }
  };

  const isEntered = (drawId) => {
    return myEntries.some(entry => entry.draw_id === drawId);
  };

  const getDrawTypeLabel = (type) => {
    if (type === '5-match') return '5 Match Draw';
    if (type === '4-match') return '4 Match Draw';
    if (type === '3-match') return '3 Match Draw';
    return type;
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return { bg: '#fef3c7', color: '#d97706' };
    if (status === 'completed') return { bg: '#dcfce7', color: '#16a34a' };
    return { bg: '#fee2e2', color: '#dc2626' };
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading draws...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Prize Draws</h1>

        <div className="dashboard-section" style={{ marginBottom: '24px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '16px', fontWeight: '600' }}>
            How It Works
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '14px' }}>
            <li>Your last 5 scores are automatically used for draw entries</li>
            <li>Each draw type requires different number of matches to win</li>
            <li>Winners are selected randomly from entries with highest matches</li>
            <li>Prize pool is distributed based on active subscriptions</li>
          </ul>
        </div>

        <div className="dashboard-section">
          <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Available Draws</h2>
          {draws.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No draws available at the moment.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {draws.map(draw => {
                const statusStyle = getStatusColor(draw.status);
                const entered = isEntered(draw.id);
                
                return (
                  <div
                    key={draw.id}
                    style={{
                      padding: '20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: entered ? '#f0fdf4' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>
                          {getDrawTypeLabel(draw.draw_type)}
                        </h3>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                          {new Date(draw.draw_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        background: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {draw.status}
                      </span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>Prize Pool:</span>
                        <span style={{ fontWeight: '700', fontSize: '18px', color: '#2563eb' }}>
                          ${draw.total_prize_pool}
                        </span>
                      </div>
                      
                      {draw.status === 'completed' && draw.winning_numbers && (
                        <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                            Winning Numbers:
                          </p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {JSON.parse(draw.winning_numbers).map((num, idx) => (
                              <span
                                key={idx}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#2563eb',
                                  color: 'white',
                                  borderRadius: '50%',
                                  fontWeight: '700',
                                  fontSize: '16px'
                                }}
                              >
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {draw.status === 'pending' && (
                      <div>
                        {entered ? (
                          <div style={{
                            padding: '12px',
                            background: '#dcfce7',
                            border: '1px solid #86efac',
                            borderRadius: '8px',
                            color: '#16a34a',
                            fontWeight: '600',
                            textAlign: 'center'
                          }}>
                            ✓ You are entered in this draw
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEnter(draw.id)}
                            style={{
                              width: '100%',
                              padding: '12px',
                              background: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '14px'
                            }}
                          >
                            Enter Draw
                          </button>
                        )}
                      </div>
                    )}

                    {draw.status === 'completed' && draw.winner_id && (
                      <div style={{
                        padding: '12px',
                        background: '#fef3c7',
                        border: '1px solid #fde047',
                        borderRadius: '8px',
                        color: '#d97706',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        Winner has been selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {myEntries.length > 0 && (
          <div className="dashboard-section" style={{ marginTop: '24px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>My Entries</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Draw</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>My Numbers</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Matches</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {myEntries.map(entry => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>
                        {getDrawTypeLabel(entry.draws?.draw_type)}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {JSON.parse(entry.entry_numbers).map((num, idx) => (
                            <span
                              key={idx}
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f3f4f6',
                                borderRadius: '50%',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          background: entry.matched_count >= 3 ? '#dcfce7' : '#f3f4f6',
                          color: entry.matched_count >= 3 ? '#16a34a' : '#6b7280'
                        }}>
                          {entry.matched_count} matches
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {entry.is_winner ? (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            background: '#fef3c7',
                            color: '#d97706'
                          }}>
                            🏆 Winner
                          </span>
                        ) : entry.draws?.status === 'completed' ? (
                          <span style={{ color: '#6b7280' }}>Not won</span>
                        ) : (
                          <span style={{ color: '#6b7280' }}>Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Draws;
