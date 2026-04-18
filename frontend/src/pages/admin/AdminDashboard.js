import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  FiHome, 
  FiTrendingUp, 
  FiAward, 
  FiCreditCard, 
  FiHeart, 
  FiSettings, 
  FiHelpCircle,
  FiBell,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit2,
  FiEye,
  FiUsers,
  FiDollarSign,
  FiStar,
  FiShield,
  FiPlay,
  FiLayers
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('USERS');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
       console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const users = [
    { id: 1, name: 'Alexander Thorne', email: 'alex.thorne@sovereign.com', status: 'ACTIVE', joined: 'Oct 12, 2023', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Elena Rodriguez', email: 'e.rodriguez@techmail.com', status: 'CANCELLED', joined: 'Jan 05, 2024', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Marcus Sterling', email: 'm.sterling@impact.io', status: 'LAPSED', joined: 'Mar 22, 2023', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  if (loading) {
    return (
      <div className="auth-container" style={{ minHeight: '100vh', background: '#000' }}>
        <div className="step-bar active" style={{ width: '60px', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  return (
    <div className={`admin-layout-lux ${sidebarOpen ? 'sidebar-active' : ''}`}>
      <aside className={`admin-sidebar-nav ${sidebarOpen ? 'show' : ''}`}>
        <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '2px', color: '#FFFFFF' }}>CHARITY HEAVY</h1>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '20px', cursor: 'pointer', display: 'none' }}>×</button>
        </div>

        <nav style={{ flex: 1 }}>
          <Link to="/admin" className="admin-nav-item active"><FiHome /> Dashboard</Link>
          <Link to="/admin/users" className="admin-nav-item"><FiTrendingUp /> Performance</Link>
          <Link to="/admin/draws" className="admin-nav-item"><FiAward /> Championships</Link>
          <Link to="/admin/subscriptions" className="admin-nav-item"><FiCreditCard /> Subscription</Link>
          <Link to="/admin/charities" className="admin-nav-item"><FiHeart /> Impact</Link>
        </nav>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
             <FiStar style={{ color: '#FAC441' }}/>
             <div style={{ fontSize: '10px', fontWeight: '800' }}>PREMIUM MEMBER<br/><span style={{ color: '#FAC441' }}>Impact Tier: Gold</span></div>
           </div>
           <button className="btn-add-gold" style={{ width: '100%', padding: '10px', fontSize: '12px' }}>Upgrade Plan</button>
        </div>

        <nav>
          <Link to="/admin/settings" className="admin-nav-item"><FiSettings /> Settings</Link>
          <Link to="/admin/support" className="admin-nav-item"><FiHelpCircle /> Support</Link>
        </nav>
      </aside>

      <main className="admin-main-pnl">
        <header className="admin-header-lux">
          <div className="admin-header-left">
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', background: 'none', border: 'none', color: '#FFF', fontSize: '24px', marginRight: '16px', cursor: 'pointer' }}>
              <FiLayers />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Admin Control Center</h1>
              <p className="hero-subtitle" style={{ fontSize: '10px', margin: 0 }}>GLOBAL SYSTEM OVERVIEW</p>
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-bell-lux"><FiBell /></div>
            <div className="admin-profile-badge">
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>System Admin</div>
                <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '800' }}>ACTIVE SESSION</div>
              </div>
              <img src="https://i.pravatar.cc/150?u=admin" className="admin-avatar-lux" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card-gold">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <FiUsers style={{ color: 'rgba(255,255,255,0.4)' }}/>
              <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>+100%</span>
            </div>
            <div className="stat-label-small">TOTAL USERS</div>
            <div className="stat-value-large">{stats?.totalUsers || 0}</div>
          </div>
          <div className="stat-card-gold">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <FiDollarSign style={{ color: 'rgba(255,255,255,0.4)' }}/>
              <span style={{ fontSize: '10px', background: 'rgba(212, 160, 23, 0.1)', color: '#D4A017', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>Active</span>
            </div>
            <div className="stat-label-small">SUBSCRIBERS</div>
            <div className="stat-value-large">{stats?.activeSubscribers || 0}</div>
          </div>
          <div className="stat-card-gold">
            <div style={{ marginBottom: '16px' }}><FiStar style={{ color: 'rgba(255,255,255,0.4)' }}/></div>
            <div className="stat-label-small">ROLLING JACKPOT</div>
            <div className="stat-value-large">£{parseFloat(stats?.rollingJackpot || 0).toLocaleString()}</div>
          </div>
          <div className="stat-card-gold">
            <div style={{ marginBottom: '16px' }}><FiHeart style={{ color: 'rgba(255,255,255,0.4)' }}/></div>
            <div className="stat-label-small">CHARITY IMPACT</div>
            <div className="stat-value-large">£{parseFloat(stats?.totalCharityAmount || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="admin-tab-group">
          {['USERS', 'DRAWS', 'WINNERS', 'CHARITIES'].map(tab => (
            <button key={tab} className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
             <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}/>
             <input type="text" placeholder="Search users by name, email..." className="admin-search-lux" style={{ paddingLeft: '48px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="admin-action-btn"><FiFilter /> FILTERS</button>
            <button className="admin-action-btn"><FiDownload /> EXPORT</button>
          </div>
        </div>

        <table className="admin-table-lux">
          <thead>
            <tr style={{ textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: '800' }}>
              <th style={{ paddingBottom: '16px' }}>MEMBER</th>
              <th style={{ paddingBottom: '16px' }}>STATUS</th>
              <th style={{ paddingBottom: '16px' }}>JOINED</th>
              <th style={{ paddingBottom: '16px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="admin-user-row">
                <td>
                  <div className="admin-user-info">
                    <img src={user.avatar} className="admin-user-avatar" alt={user.name} />
                    <div>
                      <div style={{ fontWeight: '800' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`admin-pill-lux ${user.status === 'ACTIVE' ? 'admin-pill-green' : user.status === 'CANCELLED' ? 'admin-pill-red' : 'admin-pill-yellow'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{user.joined}</td>
                <td style={{ textAlign: 'right' }}>
                  <FiEdit2 style={{ marginRight: '16px', cursor: 'pointer', opacity: 0.4 }}/>
                  <FiEye style={{ cursor: 'pointer', opacity: 0.4 }}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <aside className="admin-right-col">
          <div className="config-draw-card">
            <h3 className="config-draw-title"><FiSettings /> Configure Draw</h3>
            <label className="stat-label-tiny" style={{ fontSize: '10px', marginBottom: '8px', display: 'block' }}>SELECT TOURNAMENT</label>
            <select className="auth-input-lux" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
              <option>The Sovereign Invitational</option>
            </select>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <div style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '800', marginBottom: '4px' }}>ENTRANTS</div>
                <div style={{ fontWeight: '900', fontSize: '18px' }}>12,402</div>
              </div>
              <div style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '800', marginBottom: '4px' }}>LIKELIHOOD</div>
                <div style={{ fontWeight: '900', fontSize: '18px', color: '#10b981' }}>0.008%</div>
              </div>
            </div>
            <button className="admin-action-btn" style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}><FiLayers /> RUN SIMULATION</button>
            <button className="btn-add-gold" style={{ width: '100%', justifyContent: 'center' }}><FiPlay /> PUBLISH DRAW</button>
          </div>

          <div className="integrity-card">
            <h3 className="config-draw-title"><FiShield /> Network Integrity</h3>
            <div className="integrity-stat">
               <div className="integrity-label">
                 <span>Payment Gateway</span>
                 <span className="integrity-status-optimal">Optimal</span>
               </div>
               <div className="integrity-bar"><div className="integrity-fill" style={{ width: '95%' }}></div></div>
            </div>
            <div className="integrity-stat">
               <div className="integrity-label">
                 <span>Verification Node</span>
                 <span className="integrity-status-active">Active</span>
               </div>
               <div className="integrity-bar"><div className="integrity-fill" style={{ width: '80%' }}></div></div>
            </div>
          </div>
      </aside>
    </div>
  );
};

export default AdminDashboard;
