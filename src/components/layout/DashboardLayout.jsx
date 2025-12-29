import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { theme } from '../../theme';
import Sidebar from '../dashboard/Sidebar';
import MarketTicker from '../dashboard/MarketTicker';
import { useSearch } from '../../context';

const DashboardLayout = ({ children, activeItem }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();

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
                    <button className="relative p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group">
                        <div className="absolute top-3 right-3 w-2 h-2 bg-[#a3e635] rounded-full ring-2 ring-[#0a1f0a] animate-pulse"></div>
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
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
