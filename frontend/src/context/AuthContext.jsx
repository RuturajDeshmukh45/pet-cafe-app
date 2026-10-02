import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('pet_cafe_token');
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('pet_cafe_token');
            setUser(null);
          }
        } catch (err) {
          localStorage.removeItem('pet_cafe_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('pet_cafe_token', res.token);
        setUser(res.user);
        showToast(res.message || `Welcome back, ${res.user.name}!`, 'success', 'Logged In');
        return { success: true };
      } else {
        showToast(res.message || 'Invalid credentials', 'error', 'Login Failed');
        return { success: false, message: res.message };
      }
    } catch (err) {
      showToast('Network error during login.', 'error', 'Error');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success) {
        localStorage.setItem('pet_cafe_token', res.token);
        setUser(res.user);
        showToast(res.message || 'Account created successfully!', 'success', 'Welcome!');
        return { success: true };
      } else {
        showToast(res.message || 'Failed to create account.', 'error', 'Registration Failed');
        return { success: false, message: res.message };
      }
    } catch (err) {
      showToast('Network error during registration.', 'error', 'Error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('pet_cafe_token');
    setUser(null);
    showToast('You have been logged out safely.', 'info', 'Logged Out');
  };

  // Quick 1-click login helper for seamless testing of Customer, Staff, Admin
  const quickLogin = async (roleType) => {
    if (roleType === 'Admin') {
      return login('admin@petcafe.com', 'admin123');
    } else if (roleType === 'Staff') {
      return login('staff@petcafe.com', 'staff123');
    } else {
      return login('customer@petcafe.com', 'customer123');
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      if (res.success) {
        setUser(res.user);
        showToast('Profile updated successfully!', 'success');
        return true;
      } else {
        showToast(res.message || 'Could not update profile.', 'error');
        return false;
      }
    } catch (err) {
      showToast('Error updating profile.', 'error');
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    quickLogin,
    updateProfile,
    isAdmin: user?.roleName === 'Admin',
    isStaff: user?.roleName === 'Staff' || user?.roleName === 'Admin',
    isCustomer: user?.roleName === 'Customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
