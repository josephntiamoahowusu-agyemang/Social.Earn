import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const AdminTasks = () => {
  const { adminPostTask, adminBroadcast } = useData();
  const [taskForm, setTaskForm] = useState({ platform: 'Instagram', action: 'Follow', target: '', amount: '0.10', max: '1000' });
  const [broadcastMessage, setBroadcastMessage] = useState('');
  
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    adminPostTask({
      platform: taskForm.platform,
      action: taskForm.action,
      target: taskForm.target,
      amount: parseFloat(taskForm.amount),
      max: parseInt(taskForm.max)
    });
    setTaskForm({ ...taskForm, target: '' }); // Reset only target for convenience
    alert("Task posted successfully!");
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (broadcastMessage.trim() === '') return;
    adminBroadcast(broadcastMessage);
    setBroadcastMessage('');
    alert("Broadcast sent via WebSockets!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Task Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Post Task Form */}
        <div className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">Post a New Task</h2>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Platform</label>
                <select 
                  value={taskForm.platform} 
                  onChange={e => setTaskForm({...taskForm, platform: e.target.value})}
                  className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                >
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>YouTube</option>
                  <option>Facebook</option>
                  <option>Twitter</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Action</label>
                <select 
                  value={taskForm.action} 
                  onChange={e => setTaskForm({...taskForm, action: e.target.value})}
                  className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                >
                  <option>Follow</option>
                  <option>Like</option>
                  <option>Comment</option>
                  <option>Subscribe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Account/URL</label>
              <input required value={taskForm.target} onChange={e => setTaskForm({...taskForm, target: e.target.value})} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none" placeholder="@username or URL" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-slate-400 mb-1">Reward Amount ($)</label>
                  <input required type="number" step="0.01" value={taskForm.amount} onChange={e => setTaskForm({...taskForm, amount: e.target.value})} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Completions</label>
                  <input required type="number" value={taskForm.max} onChange={e => setTaskForm({...taskForm, max: e.target.value})} className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none" />
                </div>
            </div>

            <button type="submit" className="w-full bg-emerald-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-emerald-400 mt-4 transition-colors">
              Publish Task
            </button>
          </form>
        </div>

        {/* Global Broadcast Form */}
        <div className="bg-brand-surface p-6 rounded-2xl border border-slate-700 shadow-xl h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Live Global Broadcast</h2>
          <p className="text-slate-400 mb-4 text-sm">Send a real-time push notification to all simulated online users.</p>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1">Message Content</label>
              <textarea 
                 required 
                 rows="4" 
                 value={broadcastMessage}
                 onChange={e => setBroadcastMessage(e.target.value)}
                 className="w-full bg-brand-bg border border-slate-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none resize-none" 
                 placeholder="e.g. 🎊 Payout operations have resumed! Cashout now limits increased."
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-slate-900 font-bold py-3 rounded-lg hover:bg-blue-400 mt-4 transition-colors">
              Send Broadcast Alert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
