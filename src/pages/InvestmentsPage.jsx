import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TrendingUp, Wallet, DollarSign, Clock, Plus, ArrowUpRight, Calendar, Target, Award, CheckCircle2, X, History, LogOut } from 'lucide-react';
import { useCurrency, useAuth, useToast, useSearch } from '../context';
import { investmentService } from '../services';
import { formatCurrency } from '../utils';
import InvestModal from '../components/InvestModal';
import WithdrawInvestmentModal from '../components/WithdrawInvestmentModal';

const InvestmentsPage = () => {
    const navigate = useNavigate();
    const { currency, setCurrency } = useCurrency();
    const { searchQuery } = useSearch();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('investments'); // 'investments' or 'history'
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [investments, setInvestments] = useState([]);
    const [payoutHistory, setPayoutHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);

    useEffect(() => {
        fetchInvestments();
        if (activeTab === 'history') {
            fetchPayoutHistory();
        }
    }, [activeTab]);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const response = await investmentService.getMyInvestments();
            if (response.success) {
                const formatted = response.data.map(inv => {
                    const planDuration = inv.plan?.durationDays || 30; // Fallback
                    const planName = inv.plan?.name || 'Archived Plan';

                    const totalExpected = inv.dailyPayoutAmount * planDuration; // Approx total payout
                    const progress = totalExpected > 0
                        ? (Math.min(100, Math.round((inv.totalPayoutReceived / totalExpected) * 100)) || 0)
                        : 0;

                    return {
                        id: inv._id,
                        planName: planName,
                        amount: inv.amount,
                        dailyPayout: inv.dailyPayoutAmount,
                        totalReceived: inv.totalPayoutReceived,
                        nextPayout: new Date(inv.nextPayoutDate).toLocaleDateString(),
                        status: inv.status,
                        startDate: new Date(inv.startDate).toLocaleDateString(),
                        endDate: new Date(inv.endDate).toLocaleDateString(),
                        progress: progress,
                        color: '#a3e635', // default accent
                        duration: `${planDuration} Days`
                    };
                });
                setInvestments(formatted);
            }
        } catch (error) {
            console.error('Failed to fetch investments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayoutHistory = async () => {
        try {
            const response = await investmentService.getPayoutHistory();
            if (response.success) {
                setPayoutHistory(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch payout history:', error);
        }
    };

    const handleWithdraw = (investment) => {
        setSelectedInvestment(investment);
        setShowWithdrawModal(true);
    };

    const handleWithdrawSuccess = () => {
        fetchInvestments();
        setSelectedInvestment(null);
    };

    const filters = [
        { id: 'all', label: 'All Investments' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
    ];

    const filteredInvestments = investments.filter(inv => {
        const matchesStatus = selectedFilter === 'all' || inv.status.toLowerCase() === selectedFilter.toLowerCase();
        const matchesSearch = !searchQuery || inv.planName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const calculateTotals = () => {
        const invested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const received = investments.reduce((sum, inv) => sum + inv.totalReceived, 0);

        return {
            totalInvested: formatCurrency(invested, currency),
            totalReceived: formatCurrency(received, currency),
            activeCount: investments.filter(i => i.status === 'active').length
        };
    };

    const { totalInvested, totalReceived, activeCount } = calculateTotals();

    const handleInvestmentSuccess = () => {
        addToast('Investment successful!', 'success');
        fetchInvestments();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.dark }}>
                <Loader2 className="animate-spin text-[#a3e635] w-10 h-10" />
            </div>
        );
    }

    return (
        <DashboardLayout activeItem="investments">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">My Investments</h1>
                    <p className="text-sm text-gray-400">Track your portfolio performance</p>
                </div>
                <button
                    onClick={() => setShowInvestModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#a3e635] text-[#0a1f0a] font-bold rounded-xl hover:bg-[#8cc629] transition-all"
                >
                    <Plus size={20} />
                    New Investment
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-gray-400 text-xs font-medium">Total Invested</span>
                    <div className="text-3xl font-bold text-white mt-1">{totalInvested}</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-gray-400 text-xs font-medium">Total Returns Received</span>
                    <div className="text-3xl font-bold text-[#a3e635] mt-1">{totalReceived}</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="text-gray-400 text-xs font-medium">Active Portfolios</span>
                    <div className="text-3xl font-bold text-white mt-1">{activeCount}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => setActiveTab('investments')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'investments'
                        ? 'bg-[#a3e635] text-[#0a1f0a]'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} />
                        Active Investments
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history'
                        ? 'bg-[#a3e635] text-[#0a1f0a]'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <History size={16} />
                        Payout History
                    </div>
                </button>
            </div>

            {/* Investments List */}
            <div className="space-y-4">
                {filteredInvestments.map((inv) => (
                    <div
                        key={inv.id}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#a3e635]/50 transition-all relative overflow-hidden group"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 flex items-center justify-center text-[#a3e635]">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{inv.planName}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white">{inv.status}</span>
                                        <span>Ends: {inv.endDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Invested</p>
                                    <p className="font-bold text-white">{formatCurrency(inv.amount, currency)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Daily Return</p>
                                    <p className="font-bold text-[#a3e635]">{formatCurrency(inv.dailyPayout, currency)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Received</p>
                                    <p className="font-bold text-white">{formatCurrency(inv.totalReceived, currency)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Next Payout</p>
                                    <p className="font-bold text-white">{inv.nextPayout}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>Progress</span>
                                <span>{inv.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#a3e635] transition-all duration-1000" style={{ width: `${inv.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredInvestments.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No investments found. Start investing to see returns!
                    </div>
                )}
            </div>

            {showInvestModal && (
                <InvestModal
                    onClose={() => setShowInvestModal(false)}
                    onSuccess={handleInvestmentSuccess}
                />
            )}
        </DashboardLayout>
    );
};

// Simple loader placeholder if not imported
const Loader2 = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 4v4m-4-4h4m4-4h4" /></svg>;

export default InvestmentsPage;
