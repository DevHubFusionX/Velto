import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useAuth, useSearch } from '../context';
import { userService } from '../services';
import { formatCurrency } from '../utils';
import { VerifyEmailModal } from '../auth';
import InvestModal from '../components/InvestModal';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import StatCard from '../components/common/StatCard';
import PropTypes from 'prop-types';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { currency, setCurrency } = useCurrency();
    const { searchQuery } = useSearch();
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [selectedProductForInvest, setSelectedProductForInvest] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (force = false) => {
        try {
            // Only show loading if we don't have data yet
            if (!dashboardData) setLoading(true);
            const dashboard = await userService.getDashboard(force);
            setDashboardData(dashboard);
        } catch (error) {
            if (error.response?.status === 503) {
                console.log('Dashboard fetch skipped: System under maintenance');
            } else {
                console.error('Failed to fetch dashboard data:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInvestmentSuccess = (amount, plan) => {
        // Optimistic UI Update for Dashboard State
        setDashboardData(prev => {
            if (!prev) return prev;

            // Create a fake transaction for immediate feedback
            const optimisticTransaction = {
                id: `opt-${Date.now()}`,
                type: 'Investment',
                amount: amount,
                status: 'Completed',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                description: `Investment in ${plan.name}`
            };

            return {
                ...prev,
                totalBalance: prev.totalBalance - amount,
                totalInvested: (prev.totalInvested || 0) + amount,
                recentTransactions: [optimisticTransaction, ...prev.recentTransactions].slice(0, 5)
            };
        });

        // Trigger background refresh (force true to bypass cache)
        fetchDashboardData(true);
    };

    if (loading && !dashboardData) {
        return (
            <DashboardLayout activeItem="dashboard">
                <DashboardSkeleton />
            </DashboardLayout>
        );
    }

    const investmentProducts = (dashboardData?.products || []).filter(product =>
        !searchQuery ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const activeInvestments = dashboardData?.activeInvestments || [];
    const recentTransactions = dashboardData?.recentTransactions || [];
    const totalBalance = formatCurrency(dashboardData?.totalBalance || 0, currency);
    const totalInvested = formatCurrency(dashboardData?.totalInvested || 0, currency);
    const totalReturns = formatCurrency(dashboardData?.totalReturns || 0, currency);

    return (
        <DashboardLayout activeItem="dashboard">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">My Dashboard</h1>
                    <p className="text-sm text-gray-400">Manage your investments and track returns</p>
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

            {/* Email Verification Banner */}
            {user && !user.isEmailVerified && (
                <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Verify your email address</h3>
                            <p className="text-sm text-gray-400">Please verify your email to unlock all platform features and complete KYC.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowVerifyModal(true)}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all"
                    >
                        Verify Now
                    </button>
                </div>
            )}

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <StatCard
                    label="Total Balance"
                    value={totalBalance}
                    lockedAmount={dashboardData?.lockedBalance > 0 ? formatCurrency(dashboardData.lockedBalance, currency) : null}
                    onAction={() => navigate('/deposit')}
                    actionLabel="Deposit"
                    variant="primary"
                />

                <StatCard
                    label="Total Invested"
                    value={totalInvested}
                    subtext="In active products"
                />

                <StatCard
                    label="Total Returns"
                    value={totalReturns}
                    subtext={`+${dashboardData?.totalReturnPercentage || 0}% overall`}
                />
            </div>

            <VerifyEmailModal
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                email={user?.email}
                onVerified={() => {
                    // Refresh dashboard or user state if possible, window reload is simple
                    window.location.reload();
                }}
            />

            {/* Investment Products */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white">Investment Products</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {investmentProducts.map((product) => (
                        <div key={product.id || product._id} className="group p-6 rounded-3xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: product.color || '#a3e635' }}></div>
                            <div className="relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                                        <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-400">{product.type}</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${product.color || '#a3e635'}20` }}>
                                        <svg className="w-6 h-6" style={{ color: product.color || '#a3e635' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Returns</span>
                                        <span className="text-sm font-semibold" style={{ color: product.color || '#a3e635' }}>{product.roi || product.returns}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Duration</span>
                                        <span className="text-sm font-semibold text-white">{product.duration}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Min. Investment</span>
                                        <span className="text-sm font-semibold text-white">
                                            {typeof product.minInvestment === 'object'
                                                ? formatCurrency(currency === 'USD' ? product.minInvestment.usd : product.minInvestment.ngn, currency)
                                                : formatCurrency(product.minInvestment, currency)
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Risk Level</span>
                                        <span className="text-sm font-semibold text-white">{product.risk}</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105"
                                    style={{ backgroundColor: product.color || '#a3e635', color: theme.colors.dark }}
                                    onClick={() => {
                                        setSelectedProductForInvest(product);
                                        setShowInvestModal(true);
                                    }}
                                >
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
                        {activeInvestments.slice(0, 3).map((investment, index) => (
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
                                        <div className="text-sm font-semibold text-white">{formatCurrency(investment.amount, currency)}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400">Current Value</span>
                                        <div className="text-sm font-semibold text-white">{formatCurrency(investment.currentValue, currency)}</div>
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
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="text-sm font-medium text-[#a3e635] hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.slice(0, 5).map((transaction, index) => (
                            <div key={transaction.id || transaction._id || index} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a3e635]/20 transition-all">
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
                                        <div className="font-bold text-white">
                                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, currency)}
                                        </div>
                                        <div className={`text-xs ${transaction.status === 'Completed' ? 'text-[#a3e635]' :
                                            transaction.status === 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {transaction.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showVerifyModal && (
                <VerifyEmailModal
                    isOpen={showVerifyModal}
                    onClose={() => setShowVerifyModal(false)}
                    email={user?.email}
                    onVerified={() => {
                        fetchDashboardData();
                        window.location.reload(); // Refresh to update user state
                    }}
                />
            )}

            {showInvestModal && (
                <InvestModal
                    initialPlan={selectedProductForInvest}
                    onClose={() => {
                        setShowInvestModal(false);
                        setSelectedProductForInvest(null);
                    }}
                    onSuccess={(amount, plan) => {
                        handleInvestmentSuccess(amount, plan);
                    }}
                />
            )}
        </DashboardLayout>
    );
};

export default DashboardPage;
