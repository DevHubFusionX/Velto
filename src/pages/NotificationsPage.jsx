import { useState } from 'react';
import { Menu, Bell, TrendingUp, DollarSign, AlertCircle, CheckCircle, Info, Trash2, Check } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const NotificationsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const notifications = [
    { id: 1, type: 'success', icon: CheckCircle, title: 'Investment Completed', message: 'Your investment in Real Estate Fund has been confirmed', time: '2 hours ago', read: false },
    { id: 2, type: 'info', icon: TrendingUp, title: 'Portfolio Update', message: 'Your portfolio gained +5.2% this week', time: '5 hours ago', read: false },
    { id: 3, type: 'success', icon: DollarSign, title: 'Returns Credited', message: '₦45,000 returns credited to your wallet', time: '1 day ago', read: true },
    { id: 4, type: 'warning', icon: AlertCircle, title: 'Investment Maturing Soon', message: 'Tech Growth Fund matures in 7 days', time: '1 day ago', read: true },
    { id: 5, type: 'info', icon: Info, title: 'New Opportunity', message: 'Sustainable Energy Fund now available', time: '2 days ago', read: true },
    { id: 6, type: 'success', icon: CheckCircle, title: 'Withdrawal Processed', message: 'Your withdrawal of ₦100,000 has been processed', time: '3 days ago', read: true },
    { id: 7, type: 'info', icon: Bell, title: 'Monthly Report Ready', message: 'Your investment report for January is ready', time: '4 days ago', read: true }
  ];

  const typeColors = {
    success: { bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
    info: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    warning: { bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400' }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1f0a] via-[#0d2b0d] to-[#0a1f0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-gray-400 text-sm mt-1">{unreadCount} unread notifications</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#a3e635] rounded-xl text-sm font-medium transition-all border border-white/10 hover:border-[#a3e635]/30 flex items-center gap-2">
              <Check size={16} />
              Mark all read
            </button>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'unread', 'success', 'info', 'warning'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filter === f ? 'bg-[#a3e635] text-[#0a1f0a]' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => {
              const colors = typeColors[notification.type];
              const Icon = notification.icon;
              
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

          {notifications.length === 0 && (
            <div className="text-center py-16">
              <Bell className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-white font-semibold text-lg mb-2">No notifications</h3>
              <p className="text-gray-400 text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
