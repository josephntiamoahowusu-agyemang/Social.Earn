import React, { createContext, useState, useEffect, useContext } from 'react';

// Create simulated delay to mimic API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); // eslint-disable-line react-refresh/only-export-components

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('social_earn_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('social_earn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('social_earn_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    await delay(800); // Simulate network
    
    // Hardcoded admin
    if (email === 'admin@socialearn.com' && password === 'admin123') {
      setUser({ id: 0, role: 'admin', name: 'System Admin', email });
      setLoading(false);
      return true;
    }

    // "Login" as user
    setUser({ 
      id: Date.now(), 
      role: 'user', 
      name: email.split('@')[0], 
      email,
      earnings: 5.50, // mock initial
      socialHandles: { Instagram: '', TikTok: '', YouTube: '', Facebook: '' },
      referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase()
    });
    
    setLoading(false);
    return true;
  };

  const signup = async (data) => {
    setLoading(true);
    await delay(1000); // Simulate network
    setUser({ 
      id: Date.now(), 
      role: 'user', 
      name: data.name, 
      email: data.email,
      earnings: 0.00,
      socialHandles: { Instagram: '', TikTok: '', YouTube: '', Facebook: '' },
      referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase()
    });
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (newSocialHandles) => {
    setLoading(true);
    await delay(600);
    setUser(prev => ({
      ...prev,
      socialHandles: {
        ...prev.socialHandles,
        ...newSocialHandles
      }
    }));
    setLoading(false);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
