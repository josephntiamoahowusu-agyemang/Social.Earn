import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);

// Initial Mock Tasks Base
const INITIAL_TASKS = [
  { id: 1, platform: 'Instagram', action: 'Follow', target: '@elonmusk', amount: 0.15, max: 1000, completed: 420 },
  { id: 2, platform: 'TikTok', action: 'Like', target: 'Viral Dance Video', amount: 0.05, max: 5000, completed: 1200 },
  { id: 3, platform: 'YouTube', action: 'Subscribe', target: 'Tech Channel', amount: 0.25, max: 500, completed: 490 },
];

export const DataProvider = ({ children }) => {
  const { user, addEarnings } = useAuth();
  
  // Shared persistent state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('social_earn_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notifications, setNotifications] = useState(() => {
    const savedBroadcasts = localStorage.getItem('social_earn_broadcasts');
    const broadcasts = savedBroadcasts ? JSON.parse(savedBroadcasts) : [];
    return broadcasts;
  });
  
  // Per-user isolated states, loaded manually on auth
  const [userHistory, setUserHistory] = useState(() => {
    const saved = localStorage.getItem('social_earn_history');
    return saved ? JSON.parse(saved) : [];
  });

  // All registered users
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('social_earn_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('social_earn_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('social_earn_history', JSON.stringify(userHistory));
  }, [userHistory]);

  // Reload users from storage periodically (simulates real-time updates for admin)
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('social_earn_all_users');
      if (saved) {
        setAllUsers(JSON.parse(saved));
      }
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Listen to broadcasts via localStorage (works better than BroadcastChannel)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'social_earn_broadcasts') {
        const broadcasts = event.newValue ? JSON.parse(event.newValue) : [];
        if (broadcasts.length > 0) {
          const latestBroadcast = broadcasts[broadcasts.length - 1];
          setNotifications(prev => {
            // Avoid duplicate notifications
            if (prev.some(n => n.id === latestBroadcast.id)) {
              return prev;
            }
            return [latestBroadcast, ...prev];
          });
        }
      }
    };
    
    // Check for broadcasts on mount
    const checkBroadcasts = () => {
      const savedBroadcasts = localStorage.getItem('social_earn_broadcasts');
      if (savedBroadcasts) {
        const broadcasts = JSON.parse(savedBroadcasts);
        if (broadcasts.length > 0) {
          const recentBroadcasts = broadcasts.slice(-5).reverse();
          setNotifications(prev => {
            const newNotifs = recentBroadcasts.filter(b => !prev.some(n => n.id === b.id));
            return [...newNotifs, ...prev];
          });
        }
      }
    };
    checkBroadcasts();
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actions
  const addNotification = (notif) => {
    const payload = { id: Date.now(), timestamp: new Date(), ...notif };
    setNotifications(prev => [payload, ...prev]);
  };

  const verifyAndCompleteTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Simulate verification
    await new Promise(res => setTimeout(res, 1200));

    // Log in history
    const historyItem = {
      id: Date.now(),
      taskId: task.id,
      userId: user.id,
      amount: task.amount,
      platform: task.platform,
      action: task.action,
      timestamp: new Date().toISOString()
    };
    setUserHistory(prev => [historyItem, ...prev]);

    // Add earnings to user account
    if (addEarnings) {
      addEarnings(task.amount);
    }

    // Update global task completed count
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: t.completed + 1 } : t
    ));

    return historyItem;
  };

  const adminPostTask = (newTask) => {
    const task = {
      id: Date.now(),
      ...newTask,
      completed: 0
    };
    setTasks(prev => [task, ...prev]);
    return task;
  };

  const adminBroadcast = (message) => {
    const broadcast = { 
      id: Date.now(), 
      title: '📢 Admin Announcement', 
      message, 
      type: 'broadcast',
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage so all tabs/windows see it
    const savedBroadcasts = localStorage.getItem('social_earn_broadcasts');
    const broadcasts = savedBroadcasts ? JSON.parse(savedBroadcasts) : [];
    broadcasts.push(broadcast);
    localStorage.setItem('social_earn_broadcasts', JSON.stringify(broadcasts));
    
    // Also add to own notification queue immediately
    addNotification(broadcast);
    
    // Emit storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'social_earn_broadcasts',
      newValue: JSON.stringify(broadcasts)
    }));
  };

  const updateUserStatus = (userId, newStatus) => {
    const updated = allUsers.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    );
    setAllUsers(updated);
    localStorage.setItem('social_earn_all_users', JSON.stringify(updated));
    return updated.find(u => u.id === userId);
  };

  return (
    <DataContext.Provider value={{ 
      tasks, 
      userHistory: userHistory.filter(h => user && h.userId === user.id), 
      allHistory: userHistory,
      allUsers,
      notifications, 
      addNotification,
      verifyAndCompleteTask,
      adminPostTask,
      adminBroadcast,
      updateUserStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};
