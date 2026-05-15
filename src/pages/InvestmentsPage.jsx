import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TrendingUp, Plus, History, Loader2, CalendarClock, CheckCircle2, Clock, CircleDot } from 'lucide-react';
import { useCurrency, useAuth, useToast, useSearch } from '../context';
import { investmentService } from '../services';
import { formatCurrency } from '../utils';
import InvestModal from '../components/InvestModal';
import WithdrawInvestmentModal from '../components/WithdrawInvestmentModal';

const DayProgress = ({ startDate, endDate }) => {
    const totalMs = endDate - startDate;
    const [elapsedMs, setElapsedMs] = useState(() => Math.min(Date.now() - startDate, totalMs));
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (elapsedMs >= totalMs) return;
        const id = setInterval(() => {
            setElapsedMs(Math.min(Date.now() - startDate, totalMs));
        }, 60000);
        return () => clearInterval(id);
    }, [startDate, totalMs]);

    const totalDays = Math.ceil(totalMs / 86400000);
    const exactProgress = animated ? Math.min(elapsedMs / totalMs, 1) : 0;

    // time remaining label
    const msLeft = Math.max(totalMs - elapsedMs, 0);
    const daysLeft = Math.floor(msLeft / 86400000);
    const hoursLeft = Math.floor((msLeft % 86400000) / 3600000);
    const timeLabel = msLeft <= 0 ? 'Completed' :
        daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h left` : `${hoursLeft}h left`;

    const MAX_DOTS = 30;
    const step = totalDays <= MAX_DOTS ? 1 : Math.ceil(totalDays / MAX_DOTS);
    const dots = [];
    for (let d = 0; d < totalDays; d += step) dots.push(d);

    return (
        <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Day {Math.floor(elapsedMs / 86400000)} of {totalDays}</span>
                <span className={msLeft < 86400000 && msLeft > 0 ? 'text-yellow-400' : ''}>{timeLabel}</span>
            </div>
            <div className="flex gap-[3px] items-center">
                {dots.map((d, i) => {
                    const dotStart = d / totalDays;
                    const dotEnd = Math.min((d + step) / totalDays, 1);
                    const fill = Math.min(Math.max((exactProgress - dotStart) / (dotEnd - dotStart), 0), 1);
                    const isLeading = fill > 0 && fill < 1;
                    return (
                        <div
                            key={i}
                            className="flex-1 h-2 rounded-sm overflow-hidden"
                            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                            <div
                                className="h-full rounded-sm"
                                style={{
                                    width: `${fill * 100}%`,
                                    backgroundColor: '#a3e635',
                                    transition: animated ? 'width 0.6s ease' : 'none',
                                    transitionDelay: animated ? `${i * 25}ms` : '0ms',
                                    boxShadow: isLeading ? '0 0 8px #a3e635, 0 0 16px #a3e63560' : 'none',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Payout schedule for a single investment
const PayoutSchedule = ({ inv, currency }) => {
    const totalDays = Math.ceil((inv.endTs - inv.startTs) / 86400000);
    const today = Date.now();

    const rows = Array.from({ length: totalDays }, (_, i) => {
        const payoutTs = inv.startTs + (i + 1) * 86400000;
        const isPaid = payoutTs <= today && inv.totalReceived >= inv.dailyPayout * (i + 1);
        const isNext = !isPaid && payoutTs > today && (i === 0 || inv.startTs + i * 86400000 <= today);
        const date = new Date(payoutTs);
        return { day: i + 1, date, payoutTs, isPaid, isNext };
    });

    const paidCount = rows.filter(r => r.isPaid).length;
    const totalExpected = inv.dailyPayout * totalDays;

    return (
        <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <CalendarClock size={14} className="text-[#a3e635]" />
                    <span className="text-xs font-bold text-white">Payout Schedule</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span><span className="text-[#a3e635] font-bold">{paidCount}</span>/{totalDays} paid</span>
                    <span>Total: <span className="text-white font-bold">{formatCurrency(totalExpected, currency)}</span></span>
                </div>
            </div>

            {/* Scrollable rows */}
            <div className="max-h-52 overflow-y-auto divide-y divide-white/[0.04]">
                {rows.map(({ day, date, isPaid, isNext }) => (
                    <div
                        key={day}
                        className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                            isNext ? 'bg-[#a3e635]/5' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {isPaid ? (
                                <CheckCircle2 size={14} className="text-[#a3e635] flex-shrink-0" />
                            ) : isNext ? (
                                <CircleDot size={14} className="text-yellow-400 flex-shrink-0 animate-pulse" />
                            ) : (
                                <Clock size={14} className="text-gray-700 flex-shrink-0" />
                            )}
                            <div>
                                <span className="text-xs font-bold text-white">Day {day}</span>
                                <span className="text-[10px] text-gray-600 ml-2">
                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-bold ${
                                isPaid ? 'text-[#a3e635]' : isNext ? 'text-yellow-400' : 'text-gray-600'
                            }`}>
                                {isPaid ? '+' : ''}{formatCurrency(inv.dailyPayout, currency)}
                            </span>
                            <span className={`ml-2 text-[10px] font-bold uppercase ${
                                isPaid ? 'text-[#a3e635]/60' : isNext ? 'text-yellow-400/70' : 'text-gray-700'
                            }`}>
                                {isPaid ? 'Paid' : isNext ? 'Next' : 'Pending'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InvestmentsPage = () => {
    const navigate = useNavigate();
    const { currency } = useCurrency();
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
                    const planDuration = inv.plan?.durationDays || 30;
                    const planName = inv.plan?.name || 'Archived Plan';
                    console.log('[inv]', inv._id, 'dailyPayoutAmount:', inv.dailyPayoutAmount, 'plan.durationDays:', inv.plan?.durationDays);

                    return {
                        id: inv._id,
                        planName: planName,
                        amount: inv.amount,
                        dailyPayout: inv.dailyPayoutAmount,
                        totalReceived: inv.totalPayoutReceived || 0,
                        nextPayout: new Date(inv.nextPayoutDate).toLocaleDateString(),
                        status: inv.status,
                        startDate: new Date(inv.startDate).toLocaleDateString(),
                        endDate: new Date(inv.endDate).toLocaleDateString(),
                        startTs: new Date(inv.startDate).getTime(),
                        endTs: new Date(inv.endDate).getTime(),
                        totalDays: planDuration,
                        color: '#a3e635',
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
        const expectedTotal = investments.reduce((sum, inv) => {
            const days = inv.totalDays || Math.ceil((inv.endTs - inv.startTs) / 86400000) || 0;
            const daily = inv.dailyPayout || 0;
            return sum + (daily * days);
        }, 0);

        return {
            totalInvested: formatCurrency(invested, currency),
            totalReceived: formatCurrency(received, currency),
            expectedTotal: formatCurrency(expectedTotal, currency),
            activeCount: investments.filter(i => i.status === 'active').length
        };
    };

    const { totalInvested, totalReceived, expectedTotal, activeCount } = calculateTotals();

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                <div className="p-6 rounded-2xl border backdrop-blur-md" style={{ background: 'rgba(163,230,53,0.06)', borderColor: 'rgba(163,230,53,0.25)' }}>
                    <span className="text-gray-400 text-xs font-medium">Expected Total Payout</span>
                    <div className="text-3xl font-bold text-[#a3e635] mt-1">{expectedTotal}</div>
                    <p className="text-[10px] text-gray-600 mt-1">Across all investments</p>
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

                        {/* Day-by-Day Progress */}
                        <DayProgress startDate={inv.startTs} endDate={inv.endTs} />

                        {/* Payout Schedule */}
                        <PayoutSchedule inv={inv} currency={currency} />
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

export default InvestmentsPage;
