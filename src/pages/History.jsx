import React from 'react';
import { useData } from '../context/DataContext';

export const History = () => {
  const { userHistory } = useData();

  if (userHistory.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <p className="text-xl">No tasks completed yet.</p>
          <a href="/dashboard" className="text-brand-primary mt-4 hover:underline">Complete some tasks!</a>
       </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <h1 className="text-3xl font-bold text-white mb-8">Completed Tasks</h1>
      
      <div className="bg-brand-surface rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 rounded-tl-xl border-b border-slate-700">Date</th>
              <th className="p-4 border-b border-slate-700">Platform</th>
              <th className="p-4 border-b border-slate-700">Action</th>
              <th className="p-4 rounded-tr-xl border-b border-slate-700 text-right">Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {userHistory.map(h => (
              <tr key={h.id} className="hover:bg-slate-800 transition-colors">
                <td className="p-4 font-mono text-sm">{new Date(h.timestamp).toLocaleString()}</td>
                <td className="p-4 font-medium text-white">{h.platform}</td>
                <td className="p-4">{h.action}</td>
                <td className="p-4 text-right font-bold text-emerald-400">+${h.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
