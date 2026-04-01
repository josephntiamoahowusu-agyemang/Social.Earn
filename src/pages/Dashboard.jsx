import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-surface to-brand-bg border border-slate-700 p-8 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-brand-primary/20 border-2 border-brand-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-brand-primary">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 font-medium mt-1">Ready to earn money today?</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-md flex relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div>
            <p className="text-slate-400 font-medium mb-1">Total Earnings</p>
            <h2 className="text-4xl font-extrabold text-white">${balance.toFixed(2)}</h2>
          </div>
          <div className="ml-auto w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-primary">
            <Wallet />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-md flex relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div>
            <p className="text-slate-400 font-medium mb-1">Today's Earnings</p>
            <h2 className="text-4xl font-extrabold text-white">${todayEarned.toFixed(2)}</h2>
          </div>
          <div className="ml-auto w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-blue-400">
            <TrendingUp />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-brand-primary to-emerald-700 p-6 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-emerald-100 font-medium mb-1 truncate">Withdraw Balance</p>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Cash Out</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
            <DollarSign />
          </div>
        </motion.div>
      </div>

      {/* Tasks Feed */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Available Tasks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-surface p-5 rounded-2xl border border-slate-700 hover:border-brand-primary/50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-brand-bg rounded-xl shadow-inner">
                    {icons[task.platform] || <Share2 className="text-slate-400 w-6 h-6"/>}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{task.action} {task.target}</h3>
                    <p className="text-brand-primary font-medium mt-0.5">+${task.amount.toFixed(2)} Reward</p>
                  </div>
                </div>
                
                {visitedLinks.has(task.id) ? (
                  <button 
                    onClick={() => handleTaskComplete(task.id)}
                    disabled={processing === task.id}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      processing === task.id 
                        ? 'bg-slate-700 text-slate-400 cursor-wait'
                        : 'bg-brand-primary text-slate-900 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {processing === task.id ? (
                      <><span className="animate-spin border-2 border-slate-400 border-t-transparent rounded-full w-4 h-4"></span> Verifying...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5"/> Verify Task</>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleLinkClick(task)}
                    className="px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/50"
                  >
                    <ExternalLink className="w-4 h-4" /> Go to Link
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
