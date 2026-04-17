import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiAward, FiCheckCircle } from 'react-icons/fi';
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
      const [drawsRes, entriesRes] = await Promise.all([
        api.get('/draws/upcoming'),
        api.get('/draws/my-entries')
      ]);
      setDraws(drawsRes.data.data);
      setMyEntries(entriesRes.data.data);
    } catch (error) {
      setDraws([]);
      setMyEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = async (drawId) => {
    try {
      await api.post(`/draws/enter/${drawId}`);
      alert('Successfully entered the draw!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to enter draw');
    }
  };

  const isEntered = (drawId) => {
    return myEntries.some(entry => entry.draw_id === drawId);
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
        <h1 className="page-title">Prize Draws</h1>

        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2 className="section-title">Upcoming Draws</h2>
          {draws.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {draws.map((draw) => {
                const entered = isEntered(draw.id);
                return (
                  <div key={draw.id} style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <FiAward style={{ fontSize: '24px', color: '#f59e0b' }} />
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                            {draw.draw_type}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {format(new Date(draw.draw_date), 'MMMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a472a', marginTop: '8px' }}>
                        Prize Pool: ${draw.total_prize_pool}
                      </div>
                    </div>
                    {entered ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: '#dcfce7',
                        color: '#16a34a',
                        borderRadius: '8px',
                        fontWeight: '600'
                      }}>
                        <FiCheckCircle />
                        Entered
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnter(draw.id)}
                        className="btn-primary"
                      >
                        Enter Draw
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">No upcoming draws</div>
          )}
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">My Entries</h2>
          {myEntries.length > 0 ? (
            <div className="draws-list">
              {myEntries.map((entry) => (
                <div key={entry.id} className="draw-item">
                  <div className="draw-info">
                    <div className="draw-type">{entry.draws.draw_type}</div>
                    <div className="draw-date">
                      {format(new Date(entry.draws.draw_date), 'MMM dd, yyyy')}
                    </div>
                    {entry.is_winner && (
                      <div style={{ marginTop: '4px', color: '#16a34a', fontWeight: '600', fontSize: '13px' }}>
                        Winner!
                      </div>
                    )}
                  </div>
                  <div className={`draw-status ${entry.draws.status}`}>
                    {entry.draws.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No entries yet</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Draws;
