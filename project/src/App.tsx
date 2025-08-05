import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Login role="admin" />} />
        <Route path="/customer" element={<Login role="customer" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (user?.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  if (user?.role === 'customer') {
    return (
      <Routes>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    );
  }

  return <Navigate to="/" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;