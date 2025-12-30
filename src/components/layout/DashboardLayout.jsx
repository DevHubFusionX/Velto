import { useState, useRef, useEffect } from 'react';
import { Menu, Search, X, Bell, DollarSign, TrendingUp, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import Sidebar from '../dashboard/Sidebar';
import MarketTicker from '../dashboard/MarketTicker';
import { useSearch, useNotifications } from '../../context';

const DashboardLayout = ({ children, activeItem }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);
    const { searchQuery, setSearchQuery } = useSearch();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        success: 'text-green-400',
        info: 'text-blue-400',
        warning: 'text-yellow-400',
        deposit: 'text-[#a3e635]',
        withdrawal: 'text-orange-400',
        investment: 'text-purple-400',
        admin: 'text-red-400'
    };

    const priorityColors = {
        high: 'bg-red-500/20 text-red-500 border-red-500/20',
        normal: 'bg-blue-500/20 text-blue-500 border-blue-500/20',
        low: 'bg-gray-500/20 text-gray-500 border-gray-500/20'
    };

    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: theme.colors.dark }}>
            {/* Standardized Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-20"></div>
            </div>

            <Sidebar activeItem={activeItem} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-[#0a1f0a]/60 backdrop-blur-xl border-b border-white/5 z-30 px-8 flex items-center justify-between">
                <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#a3e635] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search assets, plans, or transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a3e635]/60 focus:bg-white/[0.07] transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="lg:hidden flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.6)]"></div>
                    <span className="text-white text-lg font-bold tracking-tight">Velto</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications Button & Dropdown */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="relative p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-[#a3e635] hover:bg-white/10 transition-all group"
                        >
                            {unreadCount > 0 && (
                                <div className="absolute top-2.5 right-2.5 min-w-[18px] h-[18px] bg-[#a3e635] rounded-full ring-2 ring-[#0a1f0a] flex items-center justify-center animate-bounce">
                                    <span className="text-[10px] font-bold text-[#0a1f0a] px-1">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </div>
                            )}
                            <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Dropdown Menu */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-4 w-80 md:w-96 bg-[#0a1f0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                    <h3 className="text-white font-bold">Recent Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-[#a3e635] hover:underline font-medium"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        <div className="divide-y divide-white/5">
                                            {notifications.slice(0, 5).map((n) => {
                                                const Icon = getIcon(n.type);
                                                return (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => {
                                                            markAsRead(n.id);
                                                            setIsNotifOpen(false);
                                                            // Handle deep-linking if metadata exists
                                                            if (n.metadata?.transactionId) {
                                                                navigate('/transactions');
                                                            } else if (n.metadata?.investmentId) {
                                                                navigate('/investments');
                                                            } else {
                                                                navigate('/notifications');
                                                            }
                                                        }}
                                                        className={`p-4 hover:bg-white/[0.03] transition-colors cursor-pointer group ${!n.read ? 'bg-[#a3e635]/[0.02]' : ''}`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 ${typeColors[n.type] || 'text-gray-400'}`}>
                                                                <Icon size={20} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-0.5">
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <p className={`text-sm font-bold truncate ${!n.read ? 'text-white' : 'text-gray-400'}`}>{n.title}</p>
                                                                        {n.priority === 'high' && (
                                                                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase bg-red-500/20 text-red-500 border border-red-500/20">High</span>
                                                                        )}
                                                                    </div>
                                                                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#a3e635]"></div>}
                                                                </div>
                                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                                                <p className="text-[10px] text-gray-600 mt-2 font-medium uppercase tracking-wider">{n.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-10 text-center">
                                            <Bell className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
                                            <p className="text-gray-500 text-sm">No new notifications</p>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to="/notifications"
                                    onClick={() => setIsNotifOpen(false)}
                                    className="block p-4 text-center bg-white/[0.02] border-t border-white/10 text-sm font-bold text-[#a3e635] hover:bg-[#a3e635] hover:text-[#0a1f0a] transition-all"
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-[#a3e635] hover:bg-white/10 transition-all"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto relative z-10 lg:ml-72 transition-all">
                <div className="pt-20 lg:pt-20">
                    <MarketTicker />
                </div>
                <div className="p-4 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
