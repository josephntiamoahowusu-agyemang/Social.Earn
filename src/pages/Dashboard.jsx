import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Wallet, TrendingUp, DollarSign,  
  Camera, Video, Smartphone, 
  CheckCircle2, Bell, LogOut, Share2, ExternalLink
} from 'lucide-react';

const icons = {
  Instagram: <Camera className="text-pink-500 w-6 h-6" />,
  TikTok: <Share2 className="text-cyan-400 w-6 h-6" />, 
  YouTube: <Video className="text-red-500 w-6 h-6" />,
  Facebook: <Smartphone className="text-blue-500 w-6 h-6" />
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, verifyAndCompleteTask } = useData();
  const [processing, setProcessing] = useState(null);
  const [visitedLinks, setVisitedLinks] = useState(new Set());
  
  // Calculate mock daily vs total for UI
  const todayEarned = (user?.earnings || 0) * 0.3; // Just mock value for demo
  const balance = user?.earnings || 0;

  const handleTaskComplete = async (taskId) => {
    setProcessing(taskId);
    await verifyAndCompleteTask(taskId);
    setProcessing(null);
  };

  const handleLinkClick = (task) => {
    let url = task.target;
    if (url.startsWith('@')) url = `https://${task.platform.toLowerCase()}.com/${url.substring(1)}`;
    else if (!url.startsWith('http')) url = `https://${url}`;
    
    window.open(url, '_blank');
    
    setVisitedLinks(prev => {
      const newSet = new Set(prev);
      newSet.add(task.id);
      return newSet;
    });
  };

  return (
    <div className="space-y-2 sm:space-y-4 md:space-y-6 animate-fade-in relative">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-surface to-brand-bg border border-slate-700 p-2 sm:p-4 md:p-8 rounded-xl sm:rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6 justify-between">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-brand-primary/20 border-2 border-brand-primary flex items-center justify-center shrink-0">
            <span className="text-sm sm:text-base md:text-2xl font-bold text-brand-primary">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-3xl font-bold text-white truncate">Welcome back, {user?.name}!</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">Ready to earn money today?</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-responsive-3">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-surface p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-brand-primary/10 rounded-full -mr-6 -mt-6 sm:-mr-10 sm:-mt-10 blur-xl"></div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium mb-0.5">Total Earnings</p>
            <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white">${balance.toFixed(2)}</h2>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-brand-bg rounded-lg md:rounded-xl flex items-center justify-center text-brand-primary shrink-0">
            <Wallet className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-surface p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-blue-500/10 rounded-full -mr-6 -mt-6 sm:-mr-10 sm:-mt-10 blur-xl"></div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium mb-0.5">Today's Earnings</p>
            <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white">${todayEarned.toFixed(2)}</h2>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-brand-bg rounded-lg md:rounded-xl flex items-center justify-center text-blue-400 shrink-0">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-brand-primary to-emerald-700 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4 cursor-pointer touch-target">
          <div>
            <p className="text-xs text-emerald-100 font-medium mb-0.5 truncate">Withdraw Balance</p>
            <h2 className="text-base sm:text-lg md:text-2xl font-bold text-white uppercase tracking-wider">Cash Out</h2>
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-white backdrop-blur-sm shrink-0">
            <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </motion.div>
      </div>

      {/* Tasks Feed */}
      <div>
        <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-white mb-2 sm:mb-4 md:mb-6">Available Tasks</h2>
        <div className="grid-responsive-2 lg:grid-cols-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-surface p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-slate-700 hover:border-brand-primary/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-brand-bg rounded-lg shadow-inner shrink-0">
                    {icons[task.platform] || <Share2 className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5"/>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base break-words">{task.action} {task.target}</h3>
                    <p className="text-brand-primary font-medium mt-0.5 text-xs sm:text-sm">+${task.amount.toFixed(2)} Reward</p>
                  </div>
                </div>
                
                {visitedLinks.has(task.id) ? (
                  <button 
                    onClick={() => handleTaskComplete(task.id)}
                    disabled={processing === task.id}
                    className={`px-2 sm:px-4 md:px-5 py-1 sm:py-2 rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0 touch-target ${
                      processing === task.id 
                        ? 'bg-slate-700 text-slate-400 cursor-wait'
                        : 'bg-brand-primary text-slate-900 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {processing === task.id ? (
                      <><span className="animate-spin border-2 border-slate-400 border-t-transparent rounded-full w-2.5 h-2.5 sm:w-3.5 sm:h-3.5"></span> <span className="hidden sm:inline">Verifying...</span></>
                    ) : (
                      <><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4"/> <span className="hidden sm:inline">Verify Task</span><span className="sm:hidden">Verify</span></>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleLinkClick(task)}
                    className="px-2 sm:px-4 md:px-5 py-1 sm:py-2 rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/50 whitespace-nowrap shrink-0 touch-target"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Go to Link</span><span className="sm:hidden">Open</span>
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
