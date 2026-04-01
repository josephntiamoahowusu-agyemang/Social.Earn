import React from 'react';
import { useData } from '../context/DataContext';
import { Camera, Video, Smartphone, Share2 } from 'lucide-react';

export const AdminUsers = () => {
  const { allHistory } = useData();
  
  // Generating some mock active users based on history
  const userMap = new Map();
  allHistory.forEach(h => {
    if(!userMap.has(h.userId)) {
      userMap.set(h.userId, { id: h.userId, name: 'User '+h.userId, tasks: 0, earnings: 0, status: 'Active' });
    }
    const u = userMap.get(h.userId);
    u.tasks += 1;
    u.earnings += h.amount;
  });

  const users = Array.from(userMap.values());
  
  if (users.length === 0) {
    users.push({ id: 99912, name: 'John_Doe123', tasks: 42, earnings: 12.50, status: 'Active', socialHandles: { Instagram: '@johndoe', TikTok: '@johndoes', YouTube: '', Facebook: '' } });
    users.push({ id: 99913, name: 'Jane_Smith00', tasks: 15, earnings: 3.75, status: 'Active', socialHandles: { Instagram: '', TikTok: '', YouTube: '@janevlogs', Facebook: '' } });
    users.push({ id: 99914, name: 'ScammerBot', tasks: 1205, earnings: 155.00, status: 'Suspended', socialHandles: { Instagram: '', TikTok: '', YouTube: '', Facebook: '' } });
  }

  // Ensure everyone has at least an empty object for UI mapping
  users.forEach(u => {
    if (!u.socialHandles) u.socialHandles = { Instagram: '', TikTok: '', YouTube: '', Facebook: '' };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Registered Users</h1>
      
      <div className="bg-brand-surface rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 rounded-tl-xl border-b border-slate-700">User ID</th>
              <th className="p-4 border-b border-slate-700">Name</th>
              <th className="p-4 border-b border-slate-700">Connected Accounts</th>
              <th className="p-4 border-b border-slate-700 text-right">Tasks Done</th>
              <th className="p-4 border-b border-slate-700 text-right">Earned ($)</th>
              <th className="p-4 border-b border-slate-700 text-center">Status</th>
              <th className="p-4 rounded-tr-xl border-b border-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800 transition-colors">
                <td className="p-4 font-mono text-xs text-slate-400">{u.id}</td>
                <td className="p-4 font-medium text-white">{u.name}</td>
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
                     <button className="text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded transition-colors">Suspend</button>
                   ) : (
                     <button className="text-sm border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-3 py-1 rounded transition-colors">Unsuspend</button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
