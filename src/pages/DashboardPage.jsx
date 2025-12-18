import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import Sidebar from '../components/dashboard/Sidebar';
import { useCurrency, useAuth } from '../context';
import { userService, investmentService } from '../services';
import { formatCurrency } from '../utils';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { currency, setCurrency } = useCurrency();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboard, products] = await Promise.all([
                userService.getDashboard(),
                investmentService.getProducts()
            ]);
            setDashboardData({ ...dashboard, products });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const investmentProducts = dashboardData?.products || [];
    const activeInvestments = dashboardData?.activeInvestments || [];
    const recentTransactions = dashboardData?.recentTransactions || [];
    const totalBalance = formatCurrency(dashboardData?.totalBalance || 0, currency);
    const totalInvested = formatCurrency(dashboardData?.totalInvested || 0, currency);
    const totalReturns = formatCurrency(dashboardData?.totalReturns || 0, currency);

    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: theme.colors.dark }}>
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-20"></div>
            </div>

            <Sidebar activeItem="dashboard" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto relative z-10 lg:ml-72">
                <div className="max-w-7xl mx-auto">
                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#a3e635]/50 transition-all"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">My Dashboard</h1>
                                <p className="text-sm text-gray-400">Manage your investments and track returns</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Currency Switcher */}
                            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                                <button
                                    onClick={() => setCurrency('NGN')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'NGN'
                                        ? 'bg-[#a3e635] text-[#0a1f0a]'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    NGN
                                </button>
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'USD'
                                        ? 'bg-[#a3e635] text-[#0a1f0a]'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    USD
                                </button>
                            </div>
                            <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 hover:border-[#a3e635]/30 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                                style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, #84cc16)` }}
                                onClick={() => navigate('/profile')}
                            >
                                <span className="font-bold text-sm" style={{ color: theme.colors.dark }}>
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        {/* Total Balance */}
                        <div className="p-6 md:p-8 rounded-3xl backdrop-blur-md group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.15), rgba(132, 204, 22, 0.05))', border: '1px solid rgba(163, 230, 53, 0.3)' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative">
                                <span className="text-gray-400 text-sm font-medium">Total Balance</span>
                                <div className="text-3xl md:text-4xl font-bold mt-2 mb-1 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">{totalBalance}</div>
                                <span className="text-sm text-gray-400">Available funds</span>
                            </div>
                        </div>

                        {/* Total Invested */}
                        <div className="p-6 md:p-8 rounded-3xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <span className="text-gray-400 text-sm font-medium">Total Invested</span>
                            <div className="text-3xl md:text-4xl font-bold text-white mt-2 mb-1">{totalInvested}</div>
                            <span className="text-sm text-gray-400">In active products</span>
                        </div>

                        {/* Total Returns */}
                        <div className="p-6 md:p-8 rounded-3xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <span className="text-gray-400 text-sm font-medium">Total Returns</span>
                            <div className="text-3xl md:text-4xl font-bold mt-2 mb-1" style={{ color: theme.colors.primary }}>{totalReturns}</div>
                            <span className="text-sm" style={{ color: theme.colors.primary }}>+6.9% overall</span>
                        </div>
                    </div>

                    {/* Investment Products */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white">Investment Products</h2>
                            <button className="px-4 py-2 rounded-xl text-sm font-medium text-[#a3e635] hover:bg-white/5 transition-all border border-[#a3e635]/30">
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {investmentProducts.map((product) => (
                                <div key={product.id} className="group p-6 rounded-3xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: product.color }}></div>
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                                                <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-400">{product.type}</span>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${product.color}20` }}>
                                                <svg className="w-6 h-6" style={{ color: product.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Returns</span>
                                                <span className="text-sm font-semibold" style={{ color: product.color }}>{product.returns}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Duration</span>
                                                <span className="text-sm font-semibold text-white">{product.duration}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Min. Investment</span>
                                                <span className="text-sm font-semibold text-white">{product.minInvestment}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-400">Risk Level</span>
                                                <span className="text-sm font-semibold text-white">{product.risk}</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105" style={{ backgroundColor: product.color, color: theme.colors.dark }}>
                                            Invest Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Investments & Recent Transactions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {/* Active Investments */}
                        <div className="p-6 md:p-8 rounded-3xl backdrop-blur-md border" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <h3 className="text-xl font-bold text-white mb-6">My Active Investments</h3>
                            <div className="space-y-4">
                                {activeInvestments.map((investment, index) => (
                                    <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a3e635]/30 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-white">{investment.product}</h4>
                                                <span className="text-xs text-gray-400">{investment.startDate} - {investment.maturityDate}</span>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#a3e635]/20 text-[#a3e635]">
                                                {investment.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <span className="text-xs text-gray-400">Invested</span>
                                                <div className="text-sm font-semibold text-white">{investment.amount}</div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400">Current Value</span>
                                                <div className="text-sm font-semibold text-white">{investment.currentValue}</div>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400">Returns</span>
                                                <div className="text-sm font-semibold" style={{ color: theme.colors.primary }}>{investment.returns}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="p-6 md:p-8 rounded-3xl backdrop-blur-md border" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
                            <div className="space-y-4">
                                {recentTransactions.map((transaction, index) => (
                                    <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a3e635]/20 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'Deposit' ? 'bg-[#a3e635]/20' :
                                                    transaction.type === 'Investment' ? 'bg-blue-400/20' :
                                                        'bg-red-400/20'
                                                    }`}>
                                                    <svg className={`w-5 h-5 ${transaction.type === 'Deposit' ? 'text-[#a3e635]' :
                                                        transaction.type === 'Investment' ? 'text-blue-400' :
                                                            'text-red-400'
                                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        {transaction.type === 'Withdrawal' ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                        )}
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{transaction.type}</div>
                                                    <div className="text-xs text-gray-400">{transaction.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-white">{transaction.amount}</div>
                                                <div className="text-xs text-[#a3e635]">{transaction.status}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
