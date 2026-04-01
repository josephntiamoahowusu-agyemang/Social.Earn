import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

// Icons
import { LayoutDashboard, CheckSquare, Users, Link as LinkIcon, LogOut, Bell, FileText, Send, Activity, Settings } from 'lucide-react';

// Pages
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminTasks } from './pages/AdminTasks';
import { AdminUsers } from './pages/AdminUsers';
import { History } from './pages/History';
import { Referrals } from './pages/Referrals';
import { Profile } from './pages/Profile';

import { AnimatePresence, motion } from 'framer-motion';

// Global Toasts Component
const NotificationToasts = () => {
   const { notifications } = useData();

   return (
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
         <AnimatePresence>
            {notifications.slice(0, 5).map((notif, idx) => (
               <motion.div 
                  key={notif.id || idx}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-brand-surface border border-brand-primary p-4 rounded-xl shadow-2xl pointer-events-auto flex gap-3 max-w-sm"
               >
                  <Bell className="w-6 h-6 text-brand-primary animate-bounce shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white">{notif.title}</h4>
                    <p className="text-sm text-slate-300 mt-1">{notif.message}</p>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
   );
};

// Layouts 
const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col">
    {/* Optional public navbar here */}
    <div className="flex-1">{children}</div>
  </div>
);

const Sidebar = ({ role }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'Task History', path: '/history', icon: <CheckSquare /> },
    { name: 'Refer & Earn', path: '/referrals', icon: <LinkIcon /> },
    { name: 'Profile', path: '/profile', icon: <Settings /> },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <Activity /> },
    { name: 'Manage Tasks', path: '/admin/tasks', icon: <FileText /> },
    { name: 'Users', path: '/admin/users', icon: <Users /> },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-72 bg-brand-surface border-r border-slate-700/50 flex flex-col shadow-2xl z-10 sticky top-0 h-screen">
      <div className="p-6 border-b border-slate-700/50">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-brand-primary tracking-tight">
          Social Earn <span className="text-sm border border-emerald-500 text-emerald-500 rounded px-2 py-0.5 ml-2 font-mono uppercase tracking-widest">{role}</span>
        </h1>
      </div>
      
      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
         {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
               <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                     isActive 
                        ? 'bg-brand-primary text-slate-900 shadow-lg shadow-brand-primary/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
               >
                  {React.cloneElement(link.icon, { className: 'w-5 h-5' })}
                  {link.name}
               </Link>
            )
         })}
      </div>

      <div className="p-6 border-t border-slate-700/50 mt-auto">
         <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
               {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="text-white font-semibold truncate text-sm">{user?.name}</p>
               <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
         </div>
         <button 
           onClick={logout} 
           className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white transition-all font-semibold"
         >
           <LogOut className="w-5 h-5" /> Log Out
         </button>
      </div>
    </aside>
  );
};

const Header = () => {
   const { notifications } = useData();
   
   return (
      <header className="h-20 border-b border-slate-700/50 bg-brand-surface/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
         <div className="flex items-center gap-4 text-slate-300">
            {/* Search or breadcrumbs could go here */}
         </div>
         <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
               <Bell className="w-6 h-6" />
               {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-brand-surface"></span>
               )}
            </button>
         </div>
      </header>
   )
}

const AppLayout = ({ children, role }) => (
  <div className="min-h-screen bg-brand-bg text-slate-100 flex font-sans">
    <Sidebar role={role} />
    <div className="flex-1 flex flex-col min-w-0">
      <Header />
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
         {children}
      </main>
    </div>
  </div>
);

// Landing
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-brand-bg to-brand-surface">
    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 text-center">
      Get Paid For Your Screen Time
    </h1>
    <p className="text-2xl mb-12 text-slate-300 max-w-2xl text-center">
      Complete simple tasks like following accounts, liking posts, and subscribing to channels. Earn real cash instantly.
    </p>
    <div className="space-x-6">
      <Link to="/signup" className="px-8 py-4 bg-emerald-500 text-slate-900 text-lg font-bold rounded-xl hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all inline-block hover:-translate-y-1">
         Start Earning Now
      </Link>
      <Link to="/login" className="px-8 py-4 bg-slate-800 border border-slate-600 text-white text-lg font-bold rounded-xl hover:bg-slate-700 transition-all inline-block hover:-translate-y-1">
         Sign In
      </Link>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-bg"><div className="animate-spin text-brand-primary border-4 border-current border-t-transparent rounded-full w-12 h-12"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  
  return children;
};

// Main App Router
function App() {
  return (
    <BrowserRouter>
      <NotificationToasts />
      <Routes>
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><Auth type="signup" /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Auth type="login" /></MainLayout>} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><AppLayout role="user"><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute requiredRole="user"><AppLayout role="user"><History /></AppLayout></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute requiredRole="user"><AppLayout role="user"><Referrals /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requiredRole="user"><AppLayout role="user"><Profile /></AppLayout></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AppLayout role="admin"><AdminDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/admin/tasks" element={<ProtectedRoute requiredRole="admin"><AppLayout role="admin"><AdminTasks /></AppLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AppLayout role="admin"><AdminUsers /></AppLayout></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
