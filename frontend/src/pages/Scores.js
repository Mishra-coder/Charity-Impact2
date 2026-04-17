import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { format } from 'date-fns';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import './Dashboard.css';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [scoreValue, setScoreValue] = useState('');
  const [scoreDate, setScoreDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await api.get('/scores');
      setScores(response.data.data);
    } catch (error) {
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const value = parseInt(scoreValue);
    if (value < 1 || value > 46) {
      setError('Score must be between 1 and 46');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/scores', {
        scoreValue: value,
        scoreDate
      });
      setShowModal(false);
      setScoreValue('');
      setScoreDate('');
      fetchScores();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add score');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this score?')) {
      return;
    }

    try {
      await api.delete(`/scores/${id}`);
      fetchScores();
    } catch (error) {
      alert('Failed to delete score');
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
          <h1 className="page-title">My Scores</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus style={{ marginRight: '8px' }} />
            Add Score
          </button>
        </div>

        <div className="dashboard-section">
          {scores.length > 0 ? (
            <div className="scores-list">
              {scores.map((score) => (
                <div key={score.id} className="score-item">
                  <div>
                    <div className="score-value">{score.score_value}</div>
                    <div className="score-date">
                      {format(new Date(score.score_date), 'MMMM dd, yyyy')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(score.id)}
                    style={{
                      background: 'none',
                      color: '#ef4444',
                      padding: '8px',
                      fontSize: '18px'
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No scores yet. Add your first score!</div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>Add New Score</h2>
              
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

                <div className="form-group">
                  <label>Score Value (1-46)</label>
                  <input
                    type="number"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    min="1"
                    max="46"
                    required
                    placeholder="Enter score"
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={scoreDate}
                    onChange={(e) => setScoreDate(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1 }}>
                    {submitting ? 'Adding...' : 'Add Score'}
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

export default Scores;
