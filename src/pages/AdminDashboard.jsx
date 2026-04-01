import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Users, Activity, CheckCircle, DollarSign } from 'lucide-react';

export const AdminDashboard = () => {
  const { tasks, allHistory } = useData();

  // Calculate mock stats
  const totalUsers = 1248; // Mock value
  const totalCompleted = tasks.reduce((acc, t) => acc + t.completed, 0);
  const totalPaid = allHistory.reduce((acc, h) => acc + h.amount, 0) + 12500; // Mock base + actual
  const activeUsers = 84; // Mock value

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="bg-brand-surface border border-slate-700 p-8 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-400 font-medium mt-1">Monitor platform engagement and user base.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Users</p>
              <h2 className="text-4xl font-extrabold text-white">{totalUsers.toLocaleString()}</h2>
            </div>
            <Users className="text-blue-400 w-8 h-8" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Completed</p>
              <h2 className="text-4xl font-extrabold text-white">{totalCompleted.toLocaleString()}</h2>
            </div>
            <CheckCircle className="text-emerald-400 w-8 h-8" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Paid Out</p>
              <h2 className="text-4xl font-extrabold text-white">${totalPaid.toLocaleString()}</h2>
            </div>
            <DollarSign className="text-yellow-400 w-8 h-8" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-medium mb-1">Active Now</p>
              <h2 className="text-4xl font-extrabold text-white">{activeUsers}</h2>
            </div>
            <Activity className="text-brand-primary w-8 h-8 animate-pulse" />
          </div>
        </motion.div>
      </div>
      
      <div className="bg-brand-surface rounded-2xl border border-slate-700 p-6 overflow-hidden relative">
         <h2 className="text-xl font-bold text-white mb-4">Live Platform Activity</h2>
         <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Activity graph visualization would appear here.</p>
         </div>
      </div>
    </div>
  );
}
