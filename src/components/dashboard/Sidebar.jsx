import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '../../theme';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid', href: '/dashboard' },
        { id: 'investments', label: 'My Investments', icon: 'chart', href: '/investments' },
        { id: 'products', label: 'Shop Products', icon: 'shopping', href: '/products' },
        { id: 'performance', label: 'Performance', icon: 'trending', href: '/performance' },
        { id: 'opportunities', label: 'Opportunities', icon: 'star', href: '/opportunities' },
    ];

    const supportItems = [
        { id: 'community', label: 'Community', icon: 'users', href: '/community' },
        { id: 'help', label: 'Help & Support', icon: 'help', href: '/help' },
    ];

    const icons = {
        grid: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
        chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        shopping: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
        trending: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
        star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
        users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
        help: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 border-r backdrop-blur-xl flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto scrollbar-hide
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
                style={{ borderColor: 'rgba(163, 230, 53, 0.1)', backgroundColor: 'rgba(10, 31, 10, 0.95)' }}>
            <div className="p-6 flex flex-col min-h-full">
                {/* Logo */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.6)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight group-hover:text-[#a3e635] transition-colors duration-300">Velto</span>
                    </div>
                </div>

                {/* Welcome Card */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#a3e635]/10 to-[#84cc16]/5 border border-[#a3e635]/20">
                    <h2 className="text-2xl font-bold mb-2 text-white">Welcome, Naya</h2>
                    <p className="text-sm text-gray-400">Here's your investment overview</p>
                </div>

                {/* Main Menu */}
                <div className="mb-8">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Main Menu</p>
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {icons[item.icon]}
                                    </svg>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Support */}
                <div className="mt-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Support</p>
                    <nav className="space-y-2">
                        {supportItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {icons[item.icon]}
                                    </svg>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
