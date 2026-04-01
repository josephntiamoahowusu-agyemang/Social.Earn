import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Copy, Gift, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Referrals = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralUrl = `https://socialearn.com/join/${user?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <h1 className="text-3xl font-bold text-white mb-8">Refer & Earn</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Referral Card */}
         <div className="bg-brand-surface p-8 rounded-2xl border border-slate-700 shadow-xl">
           <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
              <Gift className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Invite Friends</h2>
           <p className="text-slate-400 mb-6">Earn 10% of all your friends' task earnings for life. Share your unique link below.</p>
           
           <div className="flex items-center space-x-2 bg-brand-bg border border-slate-700 rounded-lg p-2">
              <code className="flex-1 text-slate-300 font-mono px-2 overflow-hidden text-ellipsis whitespace-nowrap">
                 {referralUrl}
              </code>
              <button 
                 onClick={copyToClipboard}
                 className="bg-brand-surface hover:bg-slate-700 px-4 py-2 rounded-md font-semibold text-white transition-colors flex items-center gap-2"
              >
                 {copied ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
           </div>
         </div>

         {/* Referral Stats */}
         <div className="bg-brand-surface p-8 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Your Referral Stats</h2>
            
             <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-bg p-6 rounded-xl border border-slate-700 flex items-center justify-between mb-4">
               <div>
                  <p className="text-slate-400 font-medium mb-1">Total Referrals</p>
                  <h3 className="text-3xl font-bold text-white">0</h3>
               </div>
               <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
               </div>
             </motion.div>

             <motion.div whileHover={{ scale: 1.02 }} className="bg-brand-bg p-6 rounded-xl border border-slate-700 flex items-center justify-between">
               <div>
                  <p className="text-slate-400 font-medium mb-1">Earned from Referrals</p>
                  <h3 className="text-3xl font-bold text-emerald-400">$0.00</h3>
               </div>
               <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
               </div>
             </motion.div>
         </div>
      </div>
    </div>
  );
};
