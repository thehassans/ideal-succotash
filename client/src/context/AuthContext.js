import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const AUTH_TOKEN_KEY = 'authToken';
const USER_STORAGE_KEY = 'user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (token, userData) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        const currentUser = response.data.data.user;
        setUser(currentUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data.data;

      persistAuth(token, userData);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const signup = async (name, email, password, phone = '') => {
    try {
      const response = await axios.post('/api/auth/signup', { name, email, password, phone });
      const { token, user: userData } = response.data.data;

      persistAuth(token, userData);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    try {
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
    } finally {
      clearAuth();
    }
  };

  const getAllUsers = async () => {
    const response = await axios.get('/api/auth/users');
    return response.data.data;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    getAllUsers,
    authToken: localStorage.getItem(AUTH_TOKEN_KEY),
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
