import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiTrendingUp, 
  FiAward, 
  FiCreditCard, 
  FiHeart,
  FiUser
} from 'react-icons/fi';

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
    { path: '/dashboard', label: 'DASHBOARD', icon: FiHome },
    { path: '/scores', label: 'PERFORMANCE', icon: FiTrendingUp },
    { path: '/draws', label: 'CHAMPIONSHIPS', icon: FiAward },
    { path: '/subscription', label: 'SUBSCRIPTION', icon: FiCreditCard },
    { path: '/charities', label: 'IMPACT', icon: FiHeart },
  ];

  return (
    <div className="layout-root">
      <nav className={`top-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/dashboard" className="nav-logo-text">CHARITY HEAVY</Link>

          <div className="navbar-pill-container">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActive ? 'active' : ''}`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="navbar-user" onClick={handleLogout}>
            <span className="user-name-label">{user?.fullName?.toUpperCase() || 'Z PRIME'}</span>
            <div className="navbar-avatar">
              <FiUser style={{ fontSize: '20px', margin: '4px' }} />
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
            <span className="footer-logo">CHARITY HEAVY</span>
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
