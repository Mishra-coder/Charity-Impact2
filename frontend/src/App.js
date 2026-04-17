import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import Draws from './pages/Draws';
import Subscription from './pages/Subscription';
import Charities from './pages/Charities';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDraws from './pages/admin/AdminDraws';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminCharities from './pages/admin/AdminCharities';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/scores" element={<PrivateRoute><Scores /></PrivateRoute>} />
          <Route path="/draws" element={<PrivateRoute><Draws /></PrivateRoute>} />
          <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
          <Route path="/charities" element={<PrivateRoute><Charities /></PrivateRoute>} />
          
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/draws" element={<AdminRoute><AdminDraws /></AdminRoute>} />
          <Route path="/admin/verifications" element={<AdminRoute><AdminVerifications /></AdminRoute>} />
          <Route path="/admin/charities" element={<AdminRoute><AdminCharities /></AdminRoute>} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
