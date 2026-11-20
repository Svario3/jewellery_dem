import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aurelia_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aurelia_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('aurelia_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('aurelia_user', JSON.stringify(res.data.user));
      localStorage.setItem('aurelia_token', res.data.token);
    }
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    if (res.data.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('aurelia_user', JSON.stringify(res.data.user));
      localStorage.setItem('aurelia_token', res.data.token);
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aurelia_user');
    localStorage.removeItem('aurelia_token');
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('aurelia_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
