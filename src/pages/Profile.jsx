import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Mail, Camera, Video, Smartphone, Share2, Save, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
   const { user, updateProfile, loading } = useAuth();
   const { addNotification } = useData();
   
   const [handles, setHandles] = useState(() => user?.socialHandles || {
      Instagram: '',
      TikTok: '',
      YouTube: '',
      Facebook: ''
   });

   const [saved, setSaved] = useState(false);

   const handleChange = (platform, value) => {
      setHandles(prev => ({ ...prev, [platform]: value }));
      setSaved(false);
   };

   const handleSave = async (e) => {
      e.preventDefault();
      await updateProfile(handles);
      setSaved(true);
      addNotification({ title: 'Profile Updated', message: 'Your social media handles have been saved successfully.' });
      setTimeout(() => setSaved(false), 3000);
   };

   return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in relative max-w-4xl">
         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">My Profile</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* User Info Card */}
            <div className="md:col-span-1 space-y-4 sm:space-y-6">
               <div className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-2xl sm:text-4xl mb-3 sm:mb-4 border-2 border-indigo-500/50">
                     {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-center break-words">{user?.name}</h2>
                  <p className="text-slate-400 font-medium mb-3 sm:mb-4 text-xs sm:text-base text-center break-words">{user?.email}</p>
                  <div className="w-full pt-3 sm:pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs sm:text-sm gap-2">
                     <span className="text-slate-400 truncate">Account Tag</span>
                     <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded shrink-0">#{user?.id?.toString().slice(-4) || '0000'}</span>
                  </div>
               </div>
            </div>

            {/* Social Handles Form */}
            <div className="md:col-span-2">
               <div className="bg-brand-surface p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Connected Accounts</h2>
                  <p className="text-slate-400 mb-4 sm:mb-8 text-xs sm:text-sm">Link your social media profiles so that our administrators can verify your completed tasks and approve your payouts.</p>
                  
                  <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
                     
                     <div className="space-y-3 sm:space-y-4">
                        {/* Instagram */}
                        <div>
                           <label className="flex items-center gap-2 text-slate-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 shrink-0" /> Instagram Username
                           </label>
                           <input 
                              type="text" 
                              value={handles.Instagram} 
                              onChange={(e) => handleChange('Instagram', e.target.value)}
                              placeholder="@your_instagram" 
                              className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-pink-500 transition-colors text-sm sm:text-base touch-target"
                           />
                        </div>

                        {/* TikTok */}
                        <div>
                           <label className="flex items-center gap-2 text-slate-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" /> TikTok Username
                           </label>
                           <input 
                              type="text" 
                              value={handles.TikTok} 
                              onChange={(e) => handleChange('TikTok', e.target.value)}
                              placeholder="@your_tiktok" 
                              className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm sm:text-base touch-target"
                           />
                        </div>

                        {/* YouTube */}
                        <div>
                           <label className="flex items-center gap-2 text-slate-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" /> YouTube Channel Code/Handle
                           </label>
                           <input 
                              type="text" 
                              value={handles.YouTube} 
                              onChange={(e) => handleChange('YouTube', e.target.value)}
                              placeholder="@your_channel" 
                              className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-red-500 transition-colors text-sm sm:text-base touch-target"
                           />
                        </div>

                        {/* Facebook */}
                        <div>
                           <label className="flex items-center gap-2 text-slate-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" /> Facebook Profile Link
                           </label>
                           <input 
                              type="text" 
                              value={handles.Facebook} 
                              onChange={(e) => handleChange('Facebook', e.target.value)}
                              placeholder="facebook.com/your_profile" 
                              className="w-full bg-brand-bg border border-slate-700 rounded-lg p-2 sm:p-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base touch-target"
                           />
                        </div>
                     </div>

                     <div className="pt-3 sm:pt-4 border-t border-slate-700/50 flex justify-end">
                        <button 
                           type="submit" 
                           disabled={loading}
                           className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-sm sm:text-base touch-target ${
                              saved 
                                 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 hover:bg-emerald-500/30' 
                                 : 'bg-brand-primary text-slate-900 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                           }`}
                        >
                           {loading ? (
                              <span className="animate-spin border-2 border-slate-900 border-t-transparent rounded-full w-4 h-4"></span>
                           ) : saved ? (
                              <><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Saved</span></>
                           ) : (
                              <><Save className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Save Changes</span><span className="sm:hidden">Save</span></>
                           )}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};
