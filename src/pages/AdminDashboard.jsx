import React from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Users, Activity, CheckCircle, DollarSign } from 'lucide-react';

export const AdminDashboard = () => {
  const { tasks, allHistory, allUsers } = useData();

  // Calculate actual stats
  const totalUsers = allUsers.length;
  const totalCompleted = tasks.reduce((acc, t) => acc + t.completed, 0);
  const totalPaid = allHistory.reduce((acc, h) => acc + h.amount, 0) + 12500; // Mock base + actual
  const activeUsers = allUsers.filter(u => u.status === 'Active').length;

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
    </div>
  );
}
