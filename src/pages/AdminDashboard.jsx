import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Users, Activity, CheckCircle, DollarSign, Send, Megaphone } from 'lucide-react';

export const AdminDashboard = () => {
  const { tasks, allHistory, allUsers, adminBroadcast, notifications } = useData();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Calculate actual stats
  const totalUsers = allUsers.length;
  const totalCompleted = tasks.reduce((acc, t) => acc + t.completed, 0);
  const totalPaid = allHistory.reduce((acc, h) => acc + h.amount, 0) + 12500; // Mock base + actual
  const activeUsers = allUsers.filter(u => u.status === 'Active').length;

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    
    setIsSending(true);
    await new Promise(res => setTimeout(res, 600));
    
    adminBroadcast(broadcastMessage);
    setBroadcastMessage('');
    setIsSending(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in relative">
      <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-400 font-medium mt-1 text-sm sm:text-base">Monitor platform engagement and user base.</p>
        </div>
      </div>

      <div className="grid-responsive-4 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1 truncate">Total Users</p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white">{totalUsers.toLocaleString()}</h2>
            </div>
            <Users className="text-blue-400 w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-md">
           <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1 truncate">Total Completed</p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white">{totalCompleted.toLocaleString()}</h2>
            </div>
            <CheckCircle className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-md">
           <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1 truncate">Total Paid Out</p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white truncate">${totalPaid.toLocaleString()}</h2>
            </div>
            <DollarSign className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-md">
           <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-slate-400 font-medium mb-1 truncate">Active Now</p>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white">{activeUsers}</h2>
            </div>
            <Activity className="text-brand-primary w-6 h-6 sm:w-8 sm:h-8 animate-pulse shrink-0" />
          </div>
        </motion.div>
      </div>
      
      <div className="bg-brand-surface rounded-2xl border border-slate-700 p-4 sm:p-6 overflow-hidden relative">
         <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Live Platform Activity</h2>
         <div className="text-center py-12 sm:py-16">
            <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-slate-400">Activity graph visualization would appear here.</p>
         </div>
      </div>

      {/* Broadcast Section */}
      <div className="bg-brand-surface rounded-2xl border border-slate-700 p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Global Broadcast</h2>
        </div>

        {/* Broadcast Form */}
        <div className="space-y-3">
          <textarea
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Send a message to all active users..."
            maxLength={280}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none h-24"
          />
          <div className="flex items-end justify-between gap-2">
            <span className="text-xs text-slate-500">{broadcastMessage.length}/280</span>
            <button
              onClick={handleBroadcast}
              disabled={!broadcastMessage.trim() || isSending}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending...' : 'Broadcast'}
            </button>
          </div>
        </div>

        {/* Recent Broadcasts */}
        <div className="pt-4 border-t border-slate-700 space-y-2 max-h-48 overflow-y-auto">
          <p className="text-xs text-slate-400 font-semibold">Recent broadcasts:</p>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No broadcasts sent yet</p>
          ) : (
            notifications.slice(0, 5).map(notif => (
              <div key={notif.id} className="bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs">
                <p className="text-amber-400 font-semibold mb-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                <p className="text-slate-300">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
