import { useState, useEffect } from 'react';
import { Bell, TrendingUp, DollarSign, AlertCircle, CheckCircle, Trash2, Check } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { userService } from '../services';
import { theme } from '../theme';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await userService.getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => userService.markNotificationRead(n.id)));
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'info': return TrendingUp;
      case 'warning': return AlertCircle;
      case 'deposit': return DollarSign;
      default: return Bell;
    }
  };

  const typeColors = {
    success: { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
    info: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    warning: { bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    deposit: { bg: 'from-[#a3e635]/20 to-[#a3e635]/10', border: 'border-[#a3e635]/30', text: 'text-[#a3e635]' }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeItem="notifications">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm mt-1">{unreadCount} unread notifications</p>
          </div>
          <button onClick={markAllAsRead} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#a3e635] rounded-xl text-sm font-medium transition-all border border-white/10 hover:border-[#a3e635]/30 flex items-center gap-2">
            <Check size={16} />
            Mark all read
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'unread', 'success', 'info', 'warning'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filter === f ? 'bg-[#a3e635] text-[#0a1f0a]' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const colors = typeColors[notification.type] || typeColors.info;
            const Icon = getIcon(notification.type);

            return (
              <div key={notification.id} className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl rounded-2xl p-5 border ${colors.border} hover:border-[#a3e635]/30 transition-all group ${!notification.read ? 'ring-2 ring-[#a3e635]/20' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="text-white font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-[#a3e635] flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{notification.time}</span>
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all">
                        <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-white font-semibold text-lg mb-2">No notifications</h3>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
