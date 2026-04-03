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
  const { user } = useAuth();
  
  // Shared persistent state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('social_earn_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notifications, setNotifications] = useState([]);
  
  // Per-user isolated states, loaded manually on auth
  const [userHistory, setUserHistory] = useState(() => {
    const saved = localStorage.getItem('social_earn_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Channel for cross-tab simulation
  const [channel] = useState(() => new BroadcastChannel('social_earn_realtime'));

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('social_earn_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('social_earn_history', JSON.stringify(userHistory));
  }, [userHistory]);

  // Listen to broadcasts
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'BROADCAST') {
        setNotifications(prev => [event.data.payload, ...prev]);
        // Toasts can hook into this
      }
    };
    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [channel]);

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

    // Update global task completed count
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: t.completed + 1 } : t
    ));

    // Note: User earnings increment should be tracked at AuthContext or separately 
    // for this mock we just dispatch a "Task Completed"
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
    const payload = { title: 'Admin Global Broadcast', message, type: 'broadcast' };
    channel.postMessage({ type: 'BROADCAST', payload });
    // Also add to own notification queue
    addNotification(payload);
  };

  return (
    <DataContext.Provider value={{ 
      tasks, 
      userHistory: userHistory.filter(h => user && h.userId === user.id), 
      allHistory: userHistory,
      notifications, 
      addNotification,
      verifyAndCompleteTask,
      adminPostTask,
      adminBroadcast
    }}>
      {children}
    </DataContext.Provider>
  );
};
