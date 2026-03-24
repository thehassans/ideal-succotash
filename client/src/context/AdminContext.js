import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();
const DEMO_ADMIN_TOKEN = 'local-demo-admin-token';
const DEMO_ADMIN_USERNAME = 'admin';
const DEMO_ADMIN_PASSWORD = 'admin123';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const loginWithLocalDemo = () => {
    localStorage.setItem('adminToken', DEMO_ADMIN_TOKEN);
    setIsAuthenticated(true);
    return { success: true, fallback: 'local-demo' };
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const isDemoCredentials = username === DEMO_ADMIN_USERNAME && password === DEMO_ADMIN_PASSWORD;

    try {
      const response = await axios.post('/api/admin/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        setIsAuthenticated(true);
        return { success: true };
      }

      if (isDemoCredentials) {
        return loginWithLocalDemo();
      }
    } catch (error) {
      if (isDemoCredentials) {
        return loginWithLocalDemo();
      }

      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    stats,
    login,
    logout,
    fetchStats
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
