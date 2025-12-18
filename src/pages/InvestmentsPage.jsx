import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import Sidebar from '../components/dashboard/Sidebar';
import { TrendingUp, Wallet, DollarSign, Clock, Plus, ArrowUpRight, Menu, Calendar, Target } from 'lucide-react';
import { useCurrency } from '../context';
import { investmentService } from '../services';
import { formatCurrency } from '../utils';

const InvestmentsPage = () => {
    const { currency, setCurrency } = useCurrency();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const data = await investmentService.getAll();
            setInvestments(data);
        } catch (error) {
            console.error('Failed to fetch investments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filters = [
        { id: 'all', label: 'All Investments' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
    ];

    const filteredInvestments = selectedFilter === 'all'
        ? investments
        : investments.filter(inv => inv.status.toLowerCase() === selectedFilter);

    const calculateTotals = () => {
        const invested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        const current = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
        const returns = current - invested;
        const percentage = invested > 0 ? ((returns / invested) * 100).toFixed(1) : 0;
        
        return {
            totalInvested: formatCurrency(invested, currency),
            totalCurrentValue: formatCurrency(current, currency),
            totalReturns: formatCurrency(returns, currency),
            totalReturnPercentage: `+${percentage}%`
        };
    };

    const { totalInvested, totalCurrentValue, totalReturns, totalReturnPercentage } = calculateTotals();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
                <div className="text-white text-xl">Loading investments...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: theme.colors.dark }}>
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#a3e635] blur-[150px] opacity-5"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a2e1a] blur-[120px] opacity-20"></div>
            </div>

            <Sidebar activeItem="portfolio" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto relative z-10 lg:ml-72">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#a3e635]/50 transition-all"
                            >
                                <Menu className="w-5 h-5 text-gray-400" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">My Investments</h1>
                                <p className="text-sm text-gray-400">Track your active and completed investments</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                                <button
                                    onClick={() => setCurrency('NGN')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'NGN' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400'
                                        }`}
                                >
                                    NGN
                                </button>
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currency === 'USD' ? 'bg-[#a3e635] text-[#0a1f0a]' : 'text-gray-400'
                                        }`}
                                >
                                    USD
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="group p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Wallet className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs font-medium">Total Invested</span>
                                    <div className="text-3xl font-bold text-white mt-1">{totalInvested}</div>
                                </div>
                            </div>
                        </div>
                        <div className="group p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl"></div>
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                            <Target className="w-5 h-5 text-blue-400" />
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs font-medium">Current Value</span>
                                    <div className="text-3xl font-bold text-white mt-1">{totalCurrentValue}</div>
                                </div>
                            </div>
                        </div>
                        <div className="group p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.15), rgba(132, 204, 22, 0.05))', borderColor: 'rgba(163, 230, 53, 0.3)' }}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#a3e635]/10 rounded-full blur-2xl"></div>
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#a3e635]/20 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-[#a3e635]" />
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs font-medium">Total Returns</span>
                                    <div className="text-3xl font-bold mt-1" style={{ color: theme.colors.primary }}>{totalReturns}</div>
                                </div>
                            </div>
                        </div>
                        <div className="group p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-all duration-300 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.15), rgba(132, 204, 22, 0.05))', borderColor: 'rgba(163, 230, 53, 0.3)' }}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#a3e635]/10 rounded-full blur-2xl"></div>
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#a3e635]/20 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-[#a3e635]" />
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs font-medium">ROI</span>
                                    <div className="text-3xl font-bold mt-1" style={{ color: theme.colors.primary }}>{totalReturnPercentage}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedFilter === filter.id
                                        ? 'bg-[#a3e635] text-[#0a1f0a] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Investments List */}
                    <div className="space-y-4">
                        {filteredInvestments.map((investment) => (
                            <div
                                key={investment.id}
                                className="group rounded-2xl backdrop-blur-md border hover:border-white/20 transition-all duration-300 overflow-hidden relative"
                                style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: investment.color }}></div>

                                <div className="relative grid md:grid-cols-[1fr_auto] gap-6 p-6">
                                    {/* Left Section */}
                                    <div className="space-y-5">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${investment.color}30, ${investment.color}10)` }}>
                                                    <TrendingUp className="w-8 h-8" style={{ color: investment.color }} />
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: investment.color }}>
                                                        <span className="text-[10px] font-bold text-[#0a1f0a]">{investment.returns}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white mb-1">{investment.product}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{investment.duration}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                        <span className={`font-semibold ${investment.status === 'Active' ? 'text-[#a3e635]' : 'text-blue-400'}`}>{investment.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Wallet className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs text-gray-400">Invested</span>
                                                </div>
                                                <div className="text-xl font-bold text-white">
                                                    {formatCurrency(investment.amount || 0, currency)}
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs text-gray-400">Current</span>
                                                </div>
                                                <div className="text-xl font-bold text-white">
                                                    {formatCurrency(investment.currentValue || 0, currency)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-gray-400">Investment Progress</span>
                                                <span className="text-xs font-bold" style={{ color: investment.color }}>{investment.progress}%</span>
                                            </div>
                                            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${investment.progress}%`,
                                                        background: `linear-gradient(90deg, ${investment.color}, ${investment.color}80)`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>{investment.startDate} → {investment.maturityDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex flex-col justify-between items-end gap-4 md:min-w-[200px]">
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">Total Returns</div>
                                            <div className="text-3xl font-bold mb-1" style={{ color: investment.color }}>
                                                {formatCurrency((investment.currentValue || 0) - (investment.amount || 0), currency)}
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <TrendingUp className="w-4 h-4" style={{ color: investment.color }} />
                                                <span className="text-sm font-bold" style={{ color: investment.color }}>{investment.returns}</span>
                                            </div>
                                        </div>

                                        {investment.status === 'Active' && (
                                            <div className="flex flex-col gap-2 w-full">
                                                <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2" style={{ backgroundColor: investment.color, color: '#0a1f0a' }}>
                                                    <Plus className="w-4 h-4" />
                                                    Add More
                                                </button>
                                                <button className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/10 flex items-center justify-center gap-2">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                    Withdraw
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredInvestments.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No investments found</h3>
                            <p className="text-gray-400">Try changing your filter or start a new investment</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InvestmentsPage;
