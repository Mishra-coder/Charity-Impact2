import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength++;
    let hasAlpha = false;
    let hasNum = false;
    let hasSpecial = false;
    for (let i = 0; i < pass.length; i++) {
        let code = pass.charCodeAt(i);
        if ((code > 64 && code < 91) || (code > 96 && code < 123)) hasAlpha = true;
        else if (code > 47 && code < 58) hasNum = true;
        else hasSpecial = true;
    }
    if (hasAlpha) strength++;
    if (hasNum) strength++;
    if (hasSpecial) strength++;
    return strength; 
  };

  const strength = getStrength(password);

  return (
    <div className="auth-container">
      <h1 className="auth-logo">
        <span className="logo-white">CHARITY</span>
        <span className="logo-gold">HEAVY</span>
      </h1>

      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="step-indicator">
          <div className="step-bar active"></div>
          <div className="step-bar"></div>
        </div>
        <span className="step-text">STEP 1 OF 2</span>

        <div className="auth-header">
          <h2 className="auth-title-large">Create Account</h2>
          <p className="auth-desc">Join the prestige impact network.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">FULL NAME</label>
            </div>
            <div className="input-wrapper">
              <div className="input-icon-left"><FiUser /></div>
              <input
                type="text"
                className="auth-input auth-input-with-icon"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">EMAIL ADDRESS</label>
            </div>
            <div className="input-wrapper">
              <div className="input-icon-left"><FiMail /></div>
              <input
                type="email"
                className="auth-input auth-input-with-icon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@charityheavy.com"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">PASSWORD</label>
            </div>
            <div className="input-wrapper">
              <div className="input-icon-left"><FiLock /></div>
              <input
                type="password"
                className="auth-input auth-input-with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="strength-meter-container">
              <div className={`strength-segment ${strength >= 1 ? (strength <= 2 ? 'active-weak' : strength === 3 ? 'active-medium' : 'active-strong') : ''}`}></div>
              <div className={`strength-segment ${strength >= 2 ? (strength <= 2 ? 'active-weak' : strength === 3 ? 'active-medium' : 'active-strong') : ''}`}></div>
              <div className={`strength-segment ${strength >= 3 ? (strength === 3 ? 'active-medium' : 'active-strong') : ''}`}></div>
              <div className={`strength-segment ${strength >= 4 ? 'active-strong' : ''}`}></div>
            </div>
            <p className="password-hint">Password must be at least 8 characters</p>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">CONFIRM PASSWORD</label>
            </div>
            <div className="input-wrapper">
              <div className="input-icon-left"><FiShield /></div>
              <input
                type="password"
                className="auth-input auth-input-with-icon"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'PROCESSING...' : 'CONTINUE'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have account? <Link to="/login">Login</Link></p>
        </div>
      </div>

      <footer className="site-footer" style={{ marginTop: '40px', background: 'transparent', border: 'none' }}>
        <div className="footer-container" style={{ justifyContent: 'center' }}>
          <span className="footer-copyright">© 2024 CHARITY HEAVY | THE SOVEREIGN IMPACT</span>
        </div>
      </footer>
    </div>
  );
};

export default Register;
