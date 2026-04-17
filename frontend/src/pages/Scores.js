import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import './Dashboard.css';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    scoreValue: '',
    scoreDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await api.get('/scores');
      setScores(response.data.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const scoreValue = parseInt(formData.scoreValue);
    if (scoreValue < 1 || scoreValue > 46) {
      alert('Score must be between 1 and 46');
      return;
    }

    try {
      await api.post('/scores', formData);
      setFormData({
        scoreValue: '',
        scoreDate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      fetchScores();
      alert('Score added successfully!');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to add score');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading scores...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="page-title">My Golf Scores</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showAddForm ? 'Cancel' : 'Add Score'}
          </button>
        </div>

        {showAddForm && (
          <div className="dashboard-section" style={{ marginBottom: '24px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Add New Score</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Score (1-46 Stableford Points)
                  </label>
                  <input
                    type="number"
                    name="scoreValue"
                    value={formData.scoreValue}
                    onChange={handleChange}
                    min="1"
                    max="46"
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    name="scoreDate"
                    value={formData.scoreDate}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="dashboard-section">
          <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Score History</h2>
          {scores.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No scores recorded yet. Add your first score!</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Score</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={score.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>
                        {new Date(score.score_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          background: score.score_value >= 36 ? '#dcfce7' : score.score_value >= 30 ? '#fef3c7' : '#fee2e2',
                          color: score.score_value >= 36 ? '#16a34a' : score.score_value >= 30 ? '#d97706' : '#dc2626'
                        }}>
                          {score.score_value} points
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>
                        {index < 5 ? (
                          <span style={{ color: '#2563eb', fontWeight: '500' }}>Used for draws</span>
                        ) : (
                          <span>Historical</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {scores.length >= 5 && (
          <div className="dashboard-section" style={{ marginTop: '24px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <p style={{ color: '#1e40af', fontSize: '14px', margin: 0 }}>
              <strong>Note:</strong> Your last 5 scores are automatically used for draw entries. Keep adding scores to improve your chances!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Scores;
