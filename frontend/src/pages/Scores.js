import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { 
  FiPlus, 
  FiActivity,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreValue, setScoreValue] = useState('');
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await api.get('/scores');
      setScores(response.data.data);
    } catch (err) {
      setError('Failed to fetch scores');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    setError('');
    const val = parseInt(scoreValue);
    if (isNaN(val) || val < 1 || val > 45) {
      setError('Score must be between 1 and 45');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/scores', { scoreValue: val, scoreDate });
      setScoreValue('');
      fetchScores();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add score');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgScore = scores.length > 0 
    ? (scores.reduce((acc, s) => acc + s.score_value, 0) / scores.length).toFixed(1)
    : '0.0';
  const bestScore = scores.length > 0 
    ? Math.max(...scores.map(s => s.score_value))
    : '0';

  if (loading) return <div className="loading-lux">INITIALIZING SYSTEM...</div>;

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="perf-grid-header">
          <div className="perf-title-container">
            <h1 className="perf-title">My Golf Performance</h1>
            <p className="perf-subtitle">Track your competitive momentum and synchronization across the global impact circuit.</p>
          </div>
          <button className="btn-record" onClick={() => document.getElementById('score-form').scrollIntoView({ behavior: 'smooth' })}>
            <FiPlus /> RECORD NEW ROUND
          </button>
        </header>

        <div className="perf-stats-row">
          <div className="perf-stat-card gold">
            <span className="hero-subtitle">AVERAGE SCORE</span>
            <div className="stat-val-main">{avgScore}</div>
            <span className="stat-desc-small">STABLEFORD PERFORMANCE PEAK</span>
          </div>

          <div className="perf-stat-card green">
            <span className="hero-subtitle">BEST PERFORMANCE</span>
            <div className="stat-val-main">{bestScore}</div>
            <span className="stat-desc-small">SEASON RECORD DETECTED</span>
          </div>

          <div className="perf-stat-card gray">
            <span className="hero-subtitle">LAST ROUND</span>
            <div className="stat-val-main">{scores[0]?.score_value || 'N/A'}</div>
            <span className="stat-desc-small">SYNCED ON {scores[0] ? new Date(scores[0].score_date).toLocaleDateString() : 'NO DATA'}</span>
          </div>
        </div>

        <div className="perf-content-grid">
          <div className="history-column">
            <h2 className="section-label-bold">Score History</h2>
            <div className="score-history-list">
              {scores.map((score, index) => (
                <div key={score.id} className="score-history-item">
                  <div className="score-val-circle">{score.score_value}</div>
                  <div className="score-info">
                    <span className="course-name">Sovereign Links Estate</span>
                    <span className="score-meta">STABLEFORD • {new Date(score.score_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {index === 0 && <span className="most-recent-badge">Most Recent</span>}
                </div>
              ))}
              {scores.length === 0 && (
                <div className="repository-card chart-placeholder-lux" style={{ textAlign: 'center' }}>
                  <FiActivity style={{ fontSize: '32px', color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
                  <p className="node-desc">No performance records detected in this cycle.</p>
                </div>
              )}
            </div>
          </div>

          <div className="momentum-column">
            <div className="momentum-header">
              <h3 className="node-title">Impact Momentum</h3>
              <div className="momentum-legend">
                <div className="legend-dot"></div>
                <span>SCORE SYNC</span>
              </div>
            </div>

            <div className="chart-placeholder-lux">
              <div className="chart-bar-container">
                {scores.slice(0, 7).reverse().map((s, i) => (
                  <div key={i} className="chart-bar-lux active" style={{ height: `${(s.score_value / 45) * 100}%` }}></div>
                ))}
              </div>
            </div>

            <form id="score-form" onSubmit={handleAddScore}>
              <h3 className="node-title" style={{ marginBottom: '24px' }}>Log Performance</h3>
              {error && <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
              <div className="form-group">
                <label className="form-label">STABLEFORD SCORE (1-45)</label>
                <input
                  type="number"
                  className="auth-input"
                  value={scoreValue}
                  onChange={(e) => setScoreValue(e.target.value)}
                  required
                  placeholder="Enter Score"
                  min="1"
                  max="45"
                />
              </div>
              <div className="form-group">
                <label className="form-label">DATE OF PERFORMANCE</label>
                <input
                  type="date"
                  className="auth-input"
                  value={scoreDate}
                  onChange={(e) => setScoreDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-add-round-full" disabled={isSubmitting}>
                {isSubmitting ? 'SYNCING...' : 'ADD PERFORMANCE RECORD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Scores;
