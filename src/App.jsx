import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

// Icons
import { LayoutDashboard, CheckSquare, Users, Link as LinkIcon, LogOut, Bell, FileText, Send, Activity, Settings, Menu, X } from 'lucide-react';

// Pages
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminTasks } from './pages/AdminTasks';
import { AdminUsers } from './pages/AdminUsers';
import { History } from './pages/History';
import { Referrals } from './pages/Referrals';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// Global Toasts Component
const NotificationToasts = () => {
   const { notifications } = useData();
   const [displayedNotifs, setDisplayedNotifs] = React.useState([]);

   React.useEffect(() => {
      if (notifications.length > 0) {
         const latestNotif = notifications[0];
         
         // Only add if not already displayed
         if (!displayedNotifs.some(n => n.id === latestNotif.id)) {
            setDisplayedNotifs(prev => [latestNotif, ...prev].slice(0, 5));
         }
      }
   }, [notifications]);

   const handleClose = (notifId) => {
      setDisplayedNotifs(prev => prev.filter(n => n.id !== notifId));
   };

   React.useEffect(() => {
      // Auto-dismiss notifications after 5 seconds
      const timers = displayedNotifs.map(notif => 
         setTimeout(() => {
            handleClose(notif.id);
         }, 5000)
      );

      return () => timers.forEach(timer => clearTimeout(timer));
   }, [displayedNotifs]);

   return (
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex flex-col space-y-2 pointer-events-none">
         <AnimatePresence>
            {displayedNotifs.map((notif, idx) => (
               <motion.div 
                  key={notif.id || idx}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  className="bg-brand-surface border border-brand-primary p-3 sm:p-4 rounded-xl shadow-2xl pointer-events-auto flex gap-3 max-w-xs sm:max-w-sm text-sm sm:text-base"
               >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary animate-bounce shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm sm:text-base">{notif.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{notif.message}</p>
                  </div>
                  <button
                     onClick={() => handleClose(notif.id)}
                     className="text-slate-400 hover:text-white transition-colors shrink-0 mt-1"
                     aria-label="Close notification"
                  >
                     <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
   );
};

// Layouts 
const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col">
    {/* Main content */}
    <div className="flex-1 w-full">{children}</div>
  </div>
);

const Sidebar = ({ role, isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard /> },
    { name: 'Task History', path: '/history', icon: <CheckSquare /> },
    { name: 'Refer & Earn', path: '/referrals', icon: <LinkIcon /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell /> },
    { name: 'Profile', path: '/profile', icon: <Settings /> },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: <Activity /> },
    { name: 'Manage Tasks', path: '/admin/tasks', icon: <FileText /> },
    { name: 'Users', path: '/admin/users', icon: <Users /> },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar-responsive ${isOpen ? 'sidebar-open' : 'sidebar-closed'} fixed md:static md:translate-x-0 md:opacity-100 left-0 top-0 h-screen w-56 sm:w-64 md:w-72 bg-brand-surface border-r border-slate-700/50 flex flex-col shadow-2xl z-40 md:z-10 md:sticky`}>
        <div className="p-3 sm:p-4 md:p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-brand-primary tracking-tight">
              Social Earn
            </h1>
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <span className="text-xs border border-emerald-500 text-emerald-500 rounded px-2 py-0.5 font-mono uppercase tracking-widest inline-block">{role}</span>
        </div>
        
        <div className="flex-1 py-3 sm:py-4 md:py-8 px-2 sm:px-3 md:px-4 space-y-0.5 sm:space-y-1 md:space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl transition-all font-semibold text-xs sm:text-sm md:text-base touch-target ${
                  isActive 
                    ? 'bg-brand-primary text-slate-900 shadow-lg shadow-brand-primary/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {React.cloneElement(link.icon, { className: 'w-4 h-4 sm:w-5 sm:h-5 shrink-0' })}
                <span className="truncate">{link.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-3 sm:p-4 md:p-6 border-t border-slate-700/50 mt-auto space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs sm:text-lg shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-white font-semibold truncate text-xs sm:text-sm">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg md:rounded-xl bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white transition-all font-semibold text-xs sm:text-sm md:text-base touch-target"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const NotificationModal = ({ isOpen, onClose, notifications }) => {
   if (!isOpen) return null;
   
   return (
      <>
         {/* Backdrop */}
         <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-45"
         />
         
         {/* Modal */}
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-96 bg-brand-surface border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[80vh] md:max-h-96"
         >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
               <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-primary" />
                  <h2 className="text-lg font-bold text-white">Notifications</h2>
                  {notifications.length > 0 && (
                     <span className="ml-2 bg-brand-primary text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                        {notifications.length}
                     </span>
                  )}
               </div>
               <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Close notifications"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
               {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                     <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                     <p className="text-sm">No notifications yet</p>
                  </div>
               ) : (
                  notifications.slice().reverse().map((notif, idx) => {
                     const date = new Date(notif.timestamp);
                     const formatTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                     const formatDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                     
                     return (
                        <div key={notif.id || idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-brand-primary/50 transition-colors">
                           <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-semibold text-white text-sm">{notif.title || 'Notification'}</h3>
                              <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate} {formatTime}</span>
                           </div>
                           <p className="text-xs sm:text-sm text-slate-300">{notif.message}</p>
                           {notif.type === 'broadcast' && (
                              <span className="inline-block mt-2 text-xs bg-brand-primary/20 text-brand-primary px-2 py-1 rounded-full">📢 Announcement</span>
                           )}
                        </div>
                     );
                  })
               )}
            </div>
         </motion.div>
      </>
   );
};

const Header = ({ onMenuClick, isMobileMenuOpen, onNotificationClick }) => {
   const { notifications } = useData();
   
   return (
      <header className="h-12 sm:h-16 md:h-20 border-b border-slate-700/50 bg-brand-surface/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-2 sm:px-4 md:px-8 gap-4">
         <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            aria-label="Toggle menu"
         >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
         </button>
         
         <div className="flex-1 flex items-center gap-4 text-slate-300">
            {/* Search or breadcrumbs could go here */}
         </div>
         
         <div className="flex items-center gap-3 sm:gap-6">
            <button 
               onClick={onNotificationClick}
               className="relative p-2 text-slate-400 hover:text-brand-primary transition-colors touch-target"
               aria-label="View notifications"
            >
               <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
               {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-brand-surface">
                     {notifications.length > 99 ? '99+' : notifications.length}
                  </span>
               )}
            </button>
         </div>
      </header>
   )
}

const AppLayout = ({ children, role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const { notifications } = useData();

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col md:flex-row font-sans">
      <Sidebar role={role} isOpen={mobileMenuOpen} onClose={handleCloseMobileMenu} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          isMobileMenuOpen={mobileMenuOpen}
          onNotificationClick={() => setNotificationModalOpen(!notificationModalOpen)}
        />
        <NotificationModal 
          isOpen={notificationModalOpen} 
          onClose={() => setNotificationModalOpen(false)}
          notifications={notifications}
        />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Landing
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 md:px-6 py-6 sm:py-12 md:py-20 bg-gradient-to-b from-brand-bg to-brand-surface">
    <div className="w-full max-w-3xl space-y-3 sm:space-y-4 md:space-y-8 text-center">
      <h1 className="text-responsive-h1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
        Get Paid For Your Screen Time
      </h1>
      
      <p className="text-responsive-body text-slate-300 max-w-2xl mx-auto">
        Complete simple tasks like following accounts, liking posts, and subscribing to channels. Earn real cash instantly.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-6 justify-center pt-3 sm:pt-4 md:pt-8">
        <Link 
          to="/signup" 
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-emerald-500 text-slate-900 font-bold rounded-lg sm:rounded-xl hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all inline-block hover:-translate-y-1 touch-target text-center text-xs sm:text-sm md:text-base"
        >
          Start Earning Now
        </Link>
        
        <Link 
          to="/login" 
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-slate-800 border border-slate-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-slate-700 transition-all inline-block hover:-translate-y-1 touch-target text-center text-xs sm:text-sm md:text-base"
        >
          Sign In
        </Link>
      </div>
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
        <Route path="/notifications" element={<ProtectedRoute requiredRole="user"><AppLayout role="user"><Notifications /></AppLayout></ProtectedRoute>} />
        
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
