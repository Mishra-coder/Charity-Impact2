import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser } from 'react-icons/fi';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { path: '/dashboard', label: 'DASHBOARD' },
    { path: '/scores', label: 'PERFORMANCE' },
    { path: '/draws', label: 'CHAMPIONSHIPS' },
    { path: '/subscription', label: 'SUBSCRIPTION' },
    { path: '/charities', label: 'IMPACT' },
  ];

  return (
    <div className="layout-root">
      <nav className={`top-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/dashboard" className="nav-logo-text">
            <span className="logo-white">CHARITY</span>
            <span className="logo-gold">HEAVY</span>
          </Link>

          <div className="navbar-pill-container">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="navbar-user" onClick={handleLogout}>
            <span className="user-name-label">{user?.fullName?.toUpperCase() || 'COMMANDER'}</span>
            <div className="navbar-avatar">
              <FiUser />
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content-wide">
        {children}
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-logo">
              CHARITY<span className="logo-gold">HEAVY</span>
            </span>
            <span className="footer-copyright">© 2024 CHARITY HEAVY. THE SOVEREIGN IMPACT.</span>
          </div>
          <div className="footer-links">
            <Link to="/privacy" className="footer-link">PRIVACY POLICY</Link>
            <Link to="/terms" className="footer-link">TERMS OF SERVICE</Link>
            <Link to="/charity-partners" className="footer-link">CHARITY PARTNERS</Link>
            <Link to="/contact" className="footer-link">CONTACT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
