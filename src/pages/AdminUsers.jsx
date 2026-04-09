import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Camera, Video, Smartphone, Share2, AlertCircle } from 'lucide-react';

export const AdminUsers = () => {
  const { allUsers, allHistory, updateUserStatus } = useData();
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Enrich users with activity data
  const usersWithActivity = allUsers.map(user => {
    const userTasks = allHistory.filter(h => h.userId === user.id);
    const tasks = userTasks.length;
    const earnings = userTasks.reduce((sum, h) => sum + h.amount, 0) + user.earnings;
    
    return {
      ...user,
      tasks,
      earnings,
      socialHandles: user.socialHandles || { Instagram: '', TikTok: '', YouTube: '', Facebook: '' }
    };
  });

  const users = usersWithActivity.length > 0 ? usersWithActivity : [
    { id: 99912, name: 'John_Doe123', email: 'john@example.com', tasks: 42, earnings: 12.50, status: 'Active', socialHandles: { Instagram: '@johndoe', TikTok: '@johndoes', YouTube: '', Facebook: '' } },
    { id: 99913, name: 'Jane_Smith00', email: 'jane@example.com', tasks: 15, earnings: 3.75, status: 'Active', socialHandles: { Instagram: '', TikTok: '', YouTube: '@janevlogs', Facebook: '' } },
    { id: 99914, name: 'ScammerBot', email: 'scammer@example.com', tasks: 1205, earnings: 155.00, status: 'Suspended', socialHandles: { Instagram: '', TikTok: '', YouTube: '', Facebook: '' } },
  ];

  // Ensure everyone has at least an empty object for UI mapping
  users.forEach(u => {
    if (!u.socialHandles) u.socialHandles = { Instagram: '', TikTok: '', YouTube: '', Facebook: '' };
  });

  const handleSuspendClick = (userId, userName, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const action = currentStatus === 'Active' ? 'suspend' : 'unsuspend';
    setConfirmDialog({ userId, userName, action, newStatus });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    
    setLoadingUserId(confirmDialog.userId);
    // Simulate processing delay
    await new Promise(res => setTimeout(res, 800));
    
    updateUserStatus(confirmDialog.userId, confirmDialog.newStatus);
    setLoadingUserId(null);
    setConfirmDialog(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">Registered Users</h1>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map(u => (
          <div key={u.id} className="bg-brand-surface p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-mono">{u.id}</p>
                <p className="text-white font-semibold text-sm mt-1">{u.name}</p>
                <p className="text-xs text-slate-400">{u.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {u.status}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-500">Tasks</p>
                <p className="text-white font-bold">{u.tasks}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Earned</p>
                <p className="text-emerald-400 font-bold">${u.earnings.toFixed(2)}</p>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center gap-1">
                  <Camera className={`w-3.5 h-3.5 ${u.socialHandles.Instagram ? 'text-pink-500' : 'text-slate-600'}`} title={u.socialHandles.Instagram || 'Not Connected'} />
                  <Share2 className={`w-3.5 h-3.5 ${u.socialHandles.TikTok ? 'text-cyan-400' : 'text-slate-600'}`} title={u.socialHandles.TikTok || 'Not Connected'} />
                  <Video className={`w-3.5 h-3.5 ${u.socialHandles.YouTube ? 'text-red-500' : 'text-slate-600'}`} title={u.socialHandles.YouTube || 'Not Connected'} />
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-700/50 flex gap-2">
              {u.status === 'Active' ? (
                <button 
                  onClick={() => handleSuspendClick(u.id, u.name, u.status)}
                  disabled={loadingUserId === u.id}
                  className="flex-1 text-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded transition-colors">
                  {loadingUserId === u.id ? 'Processing...' : 'Suspend'}
                </button>
              ) : (
                <button 
                  onClick={() => handleSuspendClick(u.id, u.name, u.status)}
                  disabled={loadingUserId === u.id}
                  className="flex-1 text-xs border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded transition-colors">
                  {loadingUserId === u.id ? 'Processing...' : 'Unsuspend'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-brand-surface rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <table className="w-full text-left text-slate-300 text-sm">
          <thead className="bg-slate-800 text-slate-400 text-xs">
            <tr>
              <th className="p-4 rounded-tl-xl border-b border-slate-700">User ID</th>
              <th className="p-4 border-b border-slate-700">Name</th>
              <th className="p-4 border-b border-slate-700">Email</th>
              <th className="p-4 border-b border-slate-700">Connected</th>
              <th className="p-4 border-b border-slate-700 text-right">Tasks</th>
              <th className="p-4 border-b border-slate-700 text-right">Earned ($)</th>
              <th className="p-4 border-b border-slate-700 text-center">Status</th>
              <th className="p-4 rounded-tr-xl border-b border-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800 transition-colors">
                <td className="p-4 font-mono text-xs text-slate-400">{u.id}</td>
                <td className="p-4 font-medium text-white text-sm">{u.name}</td>
                <td className="p-4 text-xs text-slate-400">{u.email}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Camera className={`w-4 h-4 ${u.socialHandles.Instagram ? 'text-pink-500' : 'text-slate-600'}`} title={u.socialHandles.Instagram || 'Not Connected'} />
                    <Share2 className={`w-4 h-4 ${u.socialHandles.TikTok ? 'text-cyan-400' : 'text-slate-600'}`} title={u.socialHandles.TikTok || 'Not Connected'} />
                    <Video className={`w-4 h-4 ${u.socialHandles.YouTube ? 'text-red-500' : 'text-slate-600'}`} title={u.socialHandles.YouTube || 'Not Connected'} />
                    <Smartphone className={`w-4 h-4 ${u.socialHandles.Facebook ? 'text-blue-500' : 'text-slate-600'}`} title={u.socialHandles.Facebook || 'Not Connected'} />
                  </div>
                </td>
                <td className="p-4 text-right">{u.tasks}</td>
                <td className="p-4 text-right font-bold text-emerald-400">${u.earnings.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                   {u.status === 'Active' ? (
                     <button 
                       onClick={() => handleSuspendClick(u.id, u.name, u.status)}
                       disabled={loadingUserId === u.id}
                       className="text-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors">
                       {loadingUserId === u.id ? 'Processing...' : 'Suspend'}
                     </button>
                   ) : (
                     <button 
                       onClick={() => handleSuspendClick(u.id, u.name, u.status)}
                       disabled={loadingUserId === u.id}
                       className="text-xs border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors">
                       {loadingUserId === u.id ? 'Processing...' : 'Unsuspend'}
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-white">
                  {confirmDialog.action === 'suspend' ? 'Suspend User' : 'Unsuspend User'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {confirmDialog.action === 'suspend' 
                    ? `Are you sure you want to suspend ${confirmDialog.userName}? They will not be able to complete tasks.`
                    : `Are you sure you want to unsuspend ${confirmDialog.userName}? They will regain access to tasks.`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                  confirmDialog.action === 'suspend'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {confirmDialog.action === 'suspend' ? 'Suspend' : 'Unsuspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
