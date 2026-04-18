import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      alert('User role updated successfully');
    } catch (error) {
      alert('Failed to update user role');
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
        <header className="dashboard-hero">
          <h1 className="hero-title">Manage Users</h1>
          <p className="hero-subtitle">SYSTEM REGISTER • IDENTITY GOVERNANCE</p>
        </header>

        <div className="momentum-card">
          <table className="champs-table">
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>JOINED</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="champs-row">
                  <td style={{ padding: '20px', fontWeight: '800' }}>{user.full_name}</td>
                  <td style={{ padding: '20px', color: 'rgba(255,255,255,0.4)' }}>{user.email}</td>
                  <td style={{ padding: '20px' }}>
                    <div className="status-glow-badge">
                      <div className={`status-dot ${user.role === 'admin' ? 'yellow' : user.role === 'subscriber' ? 'green' : 'gray'}`}></div>
                      {user.role?.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="auth-input-lux"
                      style={{
                        padding: '8px 12px',
                        background: '#0A0F0D',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    >
                      <option value="visitor">Visitor</option>
                      <option value="subscriber">Subscriber</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
