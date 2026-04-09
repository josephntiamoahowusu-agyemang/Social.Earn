import React from 'react';
import { useData } from '../context/DataContext';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Notifications = () => {
  const { notifications } = useData();

  const getIconForNotification = (notif) => {
    if (notif.type === 'broadcast' || notif.title?.includes('Announcement')) {
      return <Bell className="w-5 h-5 text-brand-primary" />;
    }
    if (notif.title?.includes('Success')) {
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
    if (notif.title?.includes('Error')) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <Info className="w-5 h-5 text-cyan-500" />;
  };

  const getColorClass = (notif) => {
    if (notif.type === 'broadcast' || notif.title?.includes('Announcement')) {
      return 'border-brand-primary/30 bg-brand-primary/5';
    }
    if (notif.title?.includes('Success')) {
      return 'border-emerald-500/30 bg-emerald-500/5';
    }
    if (notif.title?.includes('Error')) {
      return 'border-red-500/30 bg-red-500/5';
    }
    return 'border-cyan-500/30 bg-cyan-500/5';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="bg-brand-surface border border-slate-700 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-brand-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
        </div>
        <p className="text-slate-400 font-medium text-sm sm:text-base">Stay updated with announcements and messages</p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-brand-surface border border-slate-700 rounded-2xl p-8 sm:p-12 text-center">
            <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">No notifications yet</h2>
            <p className="text-sm sm:text-base text-slate-500">Check back later for updates and announcements from admins</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`bg-brand-surface border-2 rounded-2xl p-4 sm:p-6 transition-all hover:border-brand-primary/50 ${getColorClass(notif)}`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getIconForNotification(notif)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white break-words">
                        {notif.title || 'Notification'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        {formatDate(notif.timestamp)}
                      </p>
                    </div>
                    {notif.type === 'broadcast' && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-primary/20 text-brand-primary w-fit">
                        📢 Announcement
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 break-words">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {notifications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-brand-surface border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-xs sm:text-sm text-slate-400">Total Notifications</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">{notifications.length}</p>
          </div>
          <div className="bg-brand-surface border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-xs sm:text-sm text-slate-400">Announcements</p>
            <p className="text-xl sm:text-2xl font-bold text-brand-primary mt-1">
              {notifications.filter(n => n.type === 'broadcast').length}
            </p>
          </div>
          <div className="bg-brand-surface border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-xs sm:text-sm text-slate-400">Latest</p>
            <p className="text-xs sm:text-sm text-emerald-400 font-semibold mt-1">
              {notifications.length > 0 ? formatDate(notifications[0].timestamp) : 'None'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
