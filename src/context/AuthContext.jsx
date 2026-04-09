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

    // Check if user exists in saved users
    const existingUsers = localStorage.getItem('social_earn_all_users');
    const usersList = existingUsers ? JSON.parse(existingUsers) : [];
    const existingUser = usersList.find(u => u.email === email);
    
    if (existingUser) {
      setUser(existingUser);
      setLoading(false);
      return true;
    }

    // "Login" as new user (create account)
    const newUser = {
      id: Date.now(), 
      role: 'user', 
      name: email.split('@')[0], 
      email,
      earnings: 5.50, // mock initial
      socialHandles: { Instagram: '', TikTok: '', YouTube: '', Facebook: '' },
      referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      registeredAt: new Date().toISOString(),
      status: 'Active'
    };
    
    setUser(newUser);
    
    // Save to users list
    usersList.push(newUser);
    localStorage.setItem('social_earn_all_users', JSON.stringify(usersList));
    
    setLoading(false);
    return true;
  };

  const signup = async (data) => {
    setLoading(true);
    await delay(1000); // Simulate network
    
    const newUser = { 
      id: Date.now(), 
      role: 'user', 
      name: data.name, 
      email: data.email,
      phone: data.phone,
      country: data.country,
      earnings: 0.00,
      socialHandles: { Instagram: '', TikTok: '', YouTube: '', Facebook: '' },
      referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      registeredAt: new Date().toISOString(),
      status: 'Active'
    };
    
    setUser(newUser);
    
    // Save to users list in localStorage
    const existingUsers = localStorage.getItem('social_earn_all_users');
    const usersList = existingUsers ? JSON.parse(existingUsers) : [];
    usersList.push(newUser);
    localStorage.setItem('social_earn_all_users', JSON.stringify(usersList));
    
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (newSocialHandles) => {
    setLoading(true);
    await delay(600);
    const updatedUser = {
      ...user,
      socialHandles: {
        ...user.socialHandles,
        ...newSocialHandles
      }
    };
    setUser(updatedUser);
    
    // Update in users list
    const existingUsers = localStorage.getItem('social_earn_all_users');
    if (existingUsers) {
      const usersList = JSON.parse(existingUsers);
      const userIndex = usersList.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        usersList[userIndex] = updatedUser;
        localStorage.setItem('social_earn_all_users', JSON.stringify(usersList));
      }
    }
    
    setLoading(false);
    return true;
  };

  const addEarnings = (amount) => {
    const updatedUser = {
      ...user,
      earnings: (user.earnings || 0) + amount
    };
    setUser(updatedUser);
    
    // Update in users list
    const existingUsers = localStorage.getItem('social_earn_all_users');
    if (existingUsers) {
      const usersList = JSON.parse(existingUsers);
      const userIndex = usersList.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        usersList[userIndex] = updatedUser;
        localStorage.setItem('social_earn_all_users', JSON.stringify(usersList));
      }
    }
    
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, addEarnings }}>
      {children}
    </AuthContext.Provider>
  );
};
