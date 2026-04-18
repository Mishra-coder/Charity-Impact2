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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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

  const strength = password.length > 0 ? (password.length > 10 ? 4 : password.length > 7 ? 3 : 2) : 0;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="step-indicator">
          <div className="step-bar active"></div>
          <div className="step-bar"></div>
        </div>
        <span className="step-text">STEP 1 OF 2</span>

        <div className="auth-info-group">
          <h2 className="auth-title-prestige">Create Account</h2>
          <p className="auth-desc-prestige">Join the prestige impact network.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message text-warning align-center mb-16">{error}</div>}

          <div className="form-group">
            <label className="form-label">FULL NAME</label>
            <div className="input-wrapper">
              <div className="input-icon-left lux-icon-pos"><FiUser /></div>
              <input
                type="text"
                className="auth-input pl-44"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <div className="input-icon-left lux-icon-pos"><FiMail /></div>
              <input
                type="email"
                className="auth-input pl-44"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@charityheavy.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <div className="input-wrapper">
              <div className="input-icon-left lux-icon-pos"><FiLock /></div>
              <input
                type="password"
                className="auth-input pl-44"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="strength-meter-container">
              <div className={`strength-segment ${strength >= 1 ? 'active-medium' : ''}`}></div>
              <div className={`strength-segment ${strength >= 2 ? 'active-medium' : ''}`}></div>
              <div className={`strength-segment ${strength >= 3 ? 'active-strong' : ''}`}></div>
              <div className={`strength-segment ${strength >= 4 ? 'active-strong' : ''}`}></div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CONFIRM PASSWORD</label>
            <div className="input-wrapper">
              <div className="input-icon-left lux-icon-pos"><FiShield /></div>
              <input
                type="password"
                className="auth-input pl-44"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-auth-gold" disabled={loading}>
            {loading ? 'PROCESSING...' : 'CONTINUE'}
          </button>
        </form>

        <div className="auth-footer-text">
          <p>Already have account? <Link to="/login" className="auth-footer-link">Login</Link></p>
        </div>
      </div>

      <footer className="site-footer mt-40 w-full p-20">
        <div className="max-w-1200 mx-auto flex justify-center">
          <span className="footer-copy-lux m-0">© 2024 CHARITY HEAVY | THE SOVEREIGN IMPACT</span>
        </div>
      </footer>
    </div>
  );
};

export default Register;
