import React, { useState } from 'react';
import { theme } from '../../theme';
import { LoginModal, RegisterModal, ForgotPasswordModal } from '../../auth';
import { useAuth } from '../../context';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className={`flex justify-between items-center h-16 rounded-full backdrop-blur-xl border transition-all duration-500 px-6 lg:px-8
                    ${scrolled ? 'bg-[#0a1f0a]/90 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-white/5 border-white/10'}`}>
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.6)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-white text-xl font-bold tracking-tight group-hover:text-[#a3e635] transition-colors duration-300"><a href="/">Velto</a></span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="relative text-white font-medium text-sm px-5 py-2 rounded-full transition-all duration-300 hover:text-[#a3e635] group overflow-hidden"
                                    >
                                        <span className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#a3e635]/50 transition-colors duration-300"></span>
                                        <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></span>
                                        <span className="relative">Dashboard</span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="relative font-medium text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 text-[#0a1f0a] overflow-hidden group"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-[length:200%_100%] group-hover:animate-[shimmer_2s_infinite]"></span>
                                        <span className="relative font-semibold text-white">Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setShowLogin(true)} className="relative text-white font-medium text-sm px-5 py-2 rounded-full transition-all duration-300 hover:text-[#a3e635] group overflow-hidden">
                                        <span className="absolute inset-0 border border-white/20 rounded-full group-hover:border-[#a3e635]/50 transition-colors duration-300"></span>
                                        <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></span>
                                        <span className="relative">Sign In</span>
                                    </button>
                                    <button
                                        onClick={() => setShowRegister(true)}
                                        className="relative font-medium text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 text-[#0a1f0a] overflow-hidden group"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] bg-[length:200%_100%] group-hover:animate-[shimmer_2s_infinite]"></span>
                                        <span className="relative font-semibold">Open an Account</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-300 hover:text-[#a3e635] focus:outline-none p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                            >
                                <svg className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <div className={`md:hidden absolute w-full transition-all duration-500 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                        <div className="mx-6 mt-4 backdrop-blur-xl bg-[#0a1f0a]/95 border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="px-4 pt-4 pb-6 space-y-2">
                                <div className="flex flex-col gap-3 px-2">
                                    {user ? (
                                        <>
                                            <button
                                                onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                                                className="w-full text-white font-medium text-sm px-4 py-3 border border-white/20 rounded-full hover:bg-white/5 hover:border-[#a3e635]/50 transition-all duration-300"
                                            >
                                                Dashboard
                                            </button>
                                            <button
                                                onClick={() => { logout(); setIsOpen(false); }}
                                                className="w-full font-semibold text-sm px-5 py-3 rounded-full text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] transition-transform duration-300 bg-red-600"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setShowLogin(true); setIsOpen(false); }} className="w-full text-white font-medium text-sm px-4 py-3 border border-white/20 rounded-full hover:bg-white/5 hover:border-[#a3e635]/50 transition-all duration-300">
                                                Sign In
                                            </button>
                                            <button
                                                onClick={() => { setShowRegister(true); setIsOpen(false); }}
                                                className="w-full font-semibold text-sm px-5 py-3 rounded-full text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:scale-[1.02] transition-transform duration-300"
                                                style={{ backgroundColor: theme.colors.primary }}
                                            >
                                                Open an Account
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
                onSwitchToForgotPassword={() => { setShowLogin(false); setShowForgotPassword(true); }}
            />
            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
            />
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                onSwitchToLogin={() => { setShowForgotPassword(false); setShowLogin(true); }}
            />
        </>
    );
};

export default Navbar;
