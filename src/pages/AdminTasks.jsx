import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Camera, Repeat2, Music, Users, Share2, Heart, MessageCircle, CheckCircle, Globe, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const PLATFORMS = [
  { id: 'Instagram', name: 'Instagram', icon: <Camera className="w-6 h-6" />, color: 'pink' },
  { id: 'TikTok', name: 'TikTok', icon: <Music className="w-6 h-6" />, color: 'cyan' },
  { id: 'YouTube', name: 'YouTube', icon: <Repeat2 className="w-6 h-6" />, color: 'red' },
  { id: 'Facebook', name: 'Facebook', icon: <Share2 className="w-6 h-6" />, color: 'blue' },
  { id: 'Twitter', name: 'Twitter', icon: <Users className="w-6 h-6" />, color: 'sky' },
];

const ACTIONS = [
  { id: 'Follow', name: 'Follow', icon: <Users className="w-5 h-5" /> },
  { id: 'Like', name: 'Like', icon: <Heart className="w-5 h-5" /> },
  { id: 'Comment', name: 'Comment', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'Subscribe', name: 'Subscribe', icon: <CheckCircle className="w-5 h-5" /> },
];

const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  GHS: { symbol: '₵', rate: 12.50 },
  NGN: { symbol: '₦', rate: 620 },
  AUD: { symbol: 'A$', rate: 1.52 },
  CAD: { symbol: 'C$', rate: 1.36 },
  INR: { symbol: '₹', rate: 83 },
};

const convertCurrency = (amount, targetCurrency = 'USD') => {
  const rate = CURRENCY_RATES[targetCurrency]?.rate || 1;
  return (amount * rate).toFixed(2);
};

const formatCurrency = (amount, currency = 'USD') => {
  const { symbol } = CURRENCY_RATES[currency] || { symbol: '$' };
  return `${symbol}${convertCurrency(amount, currency)}`;
};

const getColorClass = (color, isSelected) => {
  const baseClass = isSelected ? 'bg-opacity-40' : 'bg-opacity-20 hover:bg-opacity-30';
  const colorMap = {
    pink: `bg-pink-500 ${baseClass}`,
    cyan: `bg-cyan-400 ${baseClass}`,
    red: `bg-red-500 ${baseClass}`,
    blue: `bg-blue-500 ${baseClass}`,
    sky: `bg-sky-400 ${baseClass}`,
  };
  return colorMap[color];
};

const getBorderClass = (color, isSelected) => {
  if (!isSelected) return 'border-slate-600';
  const colorMap = {
    pink: 'border-pink-500',
    cyan: 'border-cyan-400',
    red: 'border-red-500',
    blue: 'border-blue-500',
    sky: 'border-sky-400',
  };
  return colorMap[color];
};

const getTextColorClass = (color, isSelected) => {
  if (!isSelected) return 'text-slate-300';
  const colorMap = {
    pink: 'text-pink-400',
    cyan: 'text-cyan-300',
    red: 'text-red-400',
    blue: 'text-blue-400',
    sky: 'text-sky-300',
  };
  return colorMap[color];
};

export const AdminTasks = () => {
  const { adminPostTask } = useData();
  const [taskForm, setTaskForm] = useState({ 
    platform: '', 
    action: '', 
    target: '', 
    amount: '0.10', 
    currency: 'USD',
    max: '1000' 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.platform || !taskForm.action || !taskForm.target) {
      alert('Please select platform, action, and enter target');
      return;
    }
    
    adminPostTask({
      platform: taskForm.platform,
      action: taskForm.action,
      target: taskForm.target,
      amount: parseFloat(taskForm.amount),
      max: parseInt(taskForm.max)
    });
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setTaskForm({ platform: '', action: '', target: '', amount: '0.10', currency: 'USD', max: '1000' });
  };

  const selectedPlatform = PLATFORMS.find(p => p.id === taskForm.platform);
  const selectedAction = ACTIONS.find(a => a.id === taskForm.action);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Post a New Task</h1>
        <p className="text-slate-400 font-medium mt-1 text-sm sm:text-base">Create tasks for users to complete and earn rewards</p>
      </div>

      <form onSubmit={handleTaskSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Select Platform
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PLATFORMS.map(platform => (
              <motion.button
                key={platform.id}
                type="button"
                onClick={() => setTaskForm({...taskForm, platform: platform.id})}
                whileHover={{ scale: 1.05 }}
                className={`${getColorClass(platform.color, taskForm.platform === platform.id)} ${getBorderClass(platform.color, taskForm.platform === platform.id)} border-2 rounded-xl p-4 transition-all flex flex-col items-center gap-2 ${getTextColorClass(platform.color, taskForm.platform === platform.id)}`}
              >
                {platform.icon}
                <span className="text-xs sm:text-sm font-semibold">{platform.name}</span>
              </motion.button>
            ))}
          </div>
          {taskForm.platform && (
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs sm:text-sm text-slate-300">✓ Selected: <span className="font-bold text-white">{taskForm.platform}</span></p>
            </div>
          )}
        </div>

        {/* Action Selection */}
        {taskForm.platform && (
          <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-400" />
              Select Action
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACTIONS.map(action => (
                <motion.button
                  key={action.id}
                  type="button"
                  onClick={() => setTaskForm({...taskForm, action: action.id})}
                  whileHover={{ scale: 1.05 }}
                  className={`${taskForm.action === action.id ? 'bg-emerald-500/30 border-emerald-500' : 'bg-slate-800 border-slate-600 hover:border-slate-500'} border-2 rounded-xl p-4 transition-all flex flex-col items-center gap-2 ${taskForm.action === action.id ? 'text-emerald-300' : 'text-slate-300'}`}
                >
                  {action.icon}
                  <span className="text-xs sm:text-sm font-semibold">{action.name}</span>
                </motion.button>
              ))}
            </div>
            {taskForm.action && (
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-xs sm:text-sm text-slate-300">✓ Selected: <span className="font-bold text-white">{taskForm.action}</span></p>
              </div>
            )}
          </div>
        )}

        {/* Task Details */}
        {taskForm.platform && taskForm.action && (
          <div className="space-y-4">
            {/* Target */}
            <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
              <label className="block text-slate-300 font-semibold mb-3 text-sm sm:text-base">Target Account/URL</label>
              <input 
                required 
                value={taskForm.target} 
                onChange={e => setTaskForm({...taskForm, target: e.target.value})} 
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-brand-primary focus:outline-none text-sm sm:text-base" 
                placeholder="@username or URL"
              />
            </div>

            {/* Currency & Reward */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
                <label className="block text-slate-300 font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Select Currency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(CURRENCY_RATES).map(curr => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setTaskForm({...taskForm, currency: curr})}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        taskForm.currency === curr
                          ? 'bg-brand-primary text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
                <label className="block text-slate-300 font-semibold mb-3 text-sm sm:text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Reward Amount
                </label>
                <input 
                  required 
                  type="number" 
                  step="0.01" 
                  value={taskForm.amount} 
                  onChange={e => setTaskForm({...taskForm, amount: e.target.value})} 
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-brand-primary focus:outline-none text-sm sm:text-base" 
                />
                <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400">Conversions:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.keys(CURRENCY_RATES).slice(0, 4).map(curr => (
                      <p key={curr} className="text-xs text-slate-300">
                        {curr}: <span className="font-bold text-white">{formatCurrency(parseFloat(taskForm.amount) || 0, curr)}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Max Completions */}
            <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 rounded-2xl">
              <label className="block text-slate-300 font-semibold mb-3 text-sm sm:text-base">Max Completions</label>
              <input 
                required 
                type="number" 
                value={taskForm.max} 
                onChange={e => setTaskForm({...taskForm, max: e.target.value})} 
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-brand-primary focus:outline-none text-sm sm:text-base" 
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Publish Task
              </button>
              <button 
                type="button"
                onClick={() => setTaskForm({ platform: '', action: '', target: '', amount: '0.10', currency: 'USD', max: '1000' })}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 p-4 rounded-lg text-center text-sm"
              >
                ✓ Task published successfully!
              </motion.div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
