import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { FiPlus, FiGlobe, FiHeart } from 'react-icons/fi';

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo_url: ''
  });

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const response = await api.get('/charities');
      setCharities(response.data.data);
    } catch (error) {
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/charities', formData);
      setFormData({ name: '', description: '', website: '', logo_url: '' });
      setShowAddForm(false);
      fetchCharities();
      alert('Charity added successfully');
    } catch (error) {
      alert('Failed to add charity');
    }
  };

  const handleDelete = async (charityId) => {
    if (!window.confirm('Are you sure you want to delete this charity?')) return;
    try {
      await api.delete(`/admin/charities/${charityId}`);
      fetchCharities();
      alert('Charity deleted successfully');
    } catch (error) {
      alert('Failed to delete charity');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="auth-container" style={{ minHeight: '60vh' }}>
          <div className="step-bar active" style={{ width: '60px', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <header className="championship-header-lux">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className="hero-title" style={{ margin: 0 }}>Manage Charities</h1>
            <p className="hero-subtitle">PARTNER DIRECTORY • PHILANTHROPIC NODES</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-add-gold"
          >
            {showAddForm ? 'CANCEL' : <><FiPlus style={{ marginRight: '8px' }} /> ADD CHARITY</>}
          </button>
        </header>

        {showAddForm && (
          <div className="repository-card" style={{ marginBottom: '32px', padding: '32px' }}>
            <h2 className="node-title" style={{ marginBottom: '24px' }}>Authorize New Philanthropic Node</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="stat-label-tiny">NODE NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="auth-input-lux"
                    placeholder="Global Relief Network"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="stat-label-tiny">WEBSITE URL</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="auth-input-lux"
                    placeholder="https://relieffund.org"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="stat-label-tiny">LOGO RESOURCE URL</label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="auth-input-lux"
                    placeholder="https://cdn.relieffund.org/logo.png"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label className="stat-label-tiny">MISSION STATEMENT *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="auth-input-lux"
                    placeholder="Describe the primary mission and operational scope..."
                    style={{ resize: 'none' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-add-gold"
                  style={{ width: 'fit-content', padding: '16px 40px' }}
                >
                  AUTHORIZE NODE
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="charity-card-wrapper">
          {charities.map((charity) => (
            <div key={charity.id} className="charity-item-lux">
              <div className="charity-item-header" style={{ padding: '24px', position: 'relative', minHeight: '80px', display: 'flex', alignItems: 'center' }}>
                {charity.logo_url ? (
                  <img
                    src={charity.logo_url}
                    alt={charity.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FAC441' }}>
                    <FiHeart />
                  </div>
                )}
                <div style={{ marginLeft: '16px' }}>
                  <h3 className="node-title" style={{ fontSize: '18px', margin: 0 }}>{charity.name}</h3>
                  <div className="status-glow-badge" style={{ marginTop: '4px' }}>
                    <div className="status-dot green"></div>
                    VERIFIED
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '24px', paddingTop: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p className="node-desc" style={{ flex: 1 }}>{charity.description}</p>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  {charity.website && (
                    <button 
                      onClick={() => window.open(charity.website, '_blank')}
                      className="btn-boost"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <FiGlobe /> WEBSITE
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(charity.id)}
                    className="btn-boost"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: '#ef4444' }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminCharities;
