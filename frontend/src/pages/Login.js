import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">
            <span className="logo-white">CHARITY</span>
            <span className="logo-gold">HEAVY</span>
          </h1>
          <p className="auth-subtitle">WELCOME BACK</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message" style={{ color: '#ef4444', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@impact.com"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">PASSWORD</label>
              <Link to="/forgot-password" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>FORGOT?</Link>
            </div>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <div className="input-icon-right-lux" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>

          <button type="submit" className="btn-auth-gold" disabled={loading}>
            {loading ? 'PROCESSING...' : 'ACCESS'}
          </button>
        </form>

        <div className="auth-footer-text">
          <p>Don't have an account? <Link to="/register" className="auth-footer-link">Register</Link></p>
        </div>
      </div>

      <div className="secured-badge-lux">
        <FiShield />
        <span>SECURED BY SOVEREIGNTY PROTOCOLS</span>
      </div>

      <footer className="site-footer">
        <div className="footer-inner-lux">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="footer-logo-lux">CHARITYHEAVY</span>
            <span className="footer-copy-lux">© 2024 CHARITY HEAVY. THE SOVEREIGN IMPACT.</span>
          </div>
          <div className="footer-links">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
            <span>CONTACT</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
