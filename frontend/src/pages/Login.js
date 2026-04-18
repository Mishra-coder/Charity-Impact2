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
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">EMAIL ADDRESS</label>
            </div>
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
              <Link to="/forgot-password" name="forgot" className="forgot-link">FORGOT?</Link>
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
              <div className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'PROCESSING...' : 'ACCESS'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>

      <div className="secured-badge">
        <FiShield />
        <span>SECURED BY SOVEREIGNTY PROTOCOLS</span>
      </div>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-logo">CHARITYHEAVY</span>
            <span className="footer-copyright">© 2024 CHARITY HEAVY. THE SOVEREIGN IMPACT.</span>
          </div>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link">PRIVACY POLICY</Link>
            <Link to="/terms" className="footer-link">TERMS OF SERVICE</Link>
            <Link to="/contact" className="footer-link">CONTACT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
