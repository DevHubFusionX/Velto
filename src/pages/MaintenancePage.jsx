import React from 'react';
import { Shield, Hammer, Clock, RefreshCw } from 'lucide-react';

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-[#0a1f0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#a3e635] rounded-full blur-[150px] opacity-10"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#84cc16] rounded-full blur-[150px] opacity-10"></div>

            <div className="max-w-xl w-full text-center space-y-8 relative z-10">
                {/* Icon HUD */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a3e635] animate-pulse">
                            <Shield size={48} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[#a3e635] flex items-center justify-center text-[#0a1f0a] shadow-lg shadow-[#a3e635]/20 animate-bounce">
                            <Hammer size={20} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Defense Protocol <span className="text-[#a3e635]">Active</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                        We are currently performing scheduled maintenance to fortify our systems and upgrade your experience.
                    </p>
                </div>

                {/* HUD Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={16} className="text-[#a3e635]" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expected Completion</span>
                        </div>
                        <p className="text-white font-bold">~ 2 Hours</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <RefreshCw size={16} className="text-[#a3e635]" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Status</span>
                        </div>
                        <p className="text-white font-bold">Fortifying Core</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                        <span>Optimization Progress</span>
                        <span>85%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#a3e635] rounded-full w-[85%] shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs hover:bg-[#a3e635] hover:text-[#0a1f0a] transition-all duration-300 group"
                    >
                        Check System Status
                    </button>
                </div>

                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] pt-8">
                    Secure Asset Infrastructure &copy; 2025
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
