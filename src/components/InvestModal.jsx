import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Check, Loader2, Info } from 'lucide-react';
import { investmentService } from '../services';
import { useCurrency, useAuth } from '../context';
import { formatCurrency } from '../utils';

const InvestModal = ({ onClose, onSuccess, initialPlan }) => {
    const { currency } = useCurrency();
    const { user, setUser } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(!initialPlan);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || null);
    const [amount, setAmount] = useState('');
    const [investing, setInvesting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!initialPlan) {
            fetchPlans();
        }
    }, [initialPlan]);

    // Handle initial amount setup if a plan is pre-selected
    useEffect(() => {
        if (selectedPlan) {
            const min = selectedPlan.minAmount || selectedPlan.minInvestment?.usd;
            setAmount(min?.toString() || '');
        }
    }, [selectedPlan]);

    const fetchPlans = async () => {
        try {
            const response = await investmentService.getPlans();
            if (response.success) {
                setPlans(response.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleInvest = async () => {
        if (!selectedPlan || !amount) return;
        setInvesting(true);
        setError('');

        const investmentAmount = Number(amount);

        try {
            await investmentService.invest({
                planId: selectedPlan.id || selectedPlan._id,
                amount: investmentAmount,
                currency: currency
            });

            // Optimistic UI Update for global user state
            if (user) {
                setUser({
                    ...user,
                    totalBalance: user.totalBalance - investmentAmount,
                    totalInvested: (user.totalInvested || 0) + investmentAmount
                });
            }

            onSuccess(investmentAmount, selectedPlan);
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Investment failed');
        } finally {
            setInvesting(false);
        }
    };

    // Robust field access with fallbacks
    const planMin = selectedPlan?.minAmount || selectedPlan?.minInvestment?.usd || 0;
    const planMax = selectedPlan?.maxAmount || selectedPlan?.maxInvestment?.usd || 0;
    const dailyPayout = selectedPlan?.dailyPayout || 0;
    const isPercentage = selectedPlan?.isPercentage !== undefined ? selectedPlan.isPercentage : true; // Default to percentage for legacy

    const estimatedDaily = selectedPlan && amount ?
        (isPercentage ? (Number(amount) * dailyPayout / 100) : dailyPayout)
        : 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in transition-all duration-300">
            <div className="bg-[#0a1f0a] border border-[#a3e635]/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl my-auto overflow-hidden text-white flex flex-col max-h-[75vh] relative hover:border-[#a3e635]/40 transition-colors">

                {/* Fixed Header */}
                <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-[#0a1f0a] z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#a3e635]/10 flex items-center justify-center">
                            <Check size={20} className="text-[#a3e635]" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-white">Confirm Investment</h2>
                            <p className="text-xs text-gray-500 hidden md:block">Review your selection and finalize</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-400 hover:text-white"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 scrollbar-hide">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-[#a3e635] w-10 h-10" />
                            <p className="text-sm text-gray-400 animate-pulse">Loading amazing plans...</p>
                        </div>
                    ) : (
                        <>
                            {!selectedPlan ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {plans.map(plan => (
                                        <div
                                            key={plan._id}
                                            onClick={() => setSelectedPlan(plan)}
                                            className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#a3e635] hover:bg-[#a3e635]/5 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-6 h-6 rounded-full bg-[#a3e635] flex items-center justify-center">
                                                    <Check size={14} className="text-[#0a1f0a] font-bold" />
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-lg mb-1 group-hover:text-[#a3e635] transition-colors">{plan.name}</h4>
                                            <div className="text-[#a3e635] font-black text-2xl mb-3">
                                                {plan.isPercentage ? `${plan.dailyPayout}%` : formatCurrency(plan.dailyPayout, currency)}
                                                <span className="text-xs text-gray-400 font-medium ml-1.5 uppercase tracking-wider">/ Daily</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-medium">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-tighter text-gray-500">Duration</span>
                                                    <span className="text-white">{plan.durationDays} Days</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[10px] uppercase tracking-tighter text-gray-500">Min. Entry</span>
                                                    <span className="text-white">{formatCurrency(plan.minAmount, currency)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    {!initialPlan && (
                                        <button
                                            onClick={() => setSelectedPlan(null)}
                                            className="text-xs font-bold text-[#a3e635] hover:text-white flex items-center gap-2 uppercase tracking-widest bg-[#a3e635]/5 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <X size={14} /> Change Plan
                                        </button>
                                    )}

                                    {/* Plan Detail Card */}
                                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#a3e635]/10 to-transparent border border-[#a3e635]/20 shadow-inner">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-black text-2xl md:text-3xl text-white tracking-tight">{selectedPlan.name}</h4>
                                                <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-[90%] leading-relaxed">{selectedPlan.roiDescription || selectedPlan.description}</p>
                                            </div>
                                            <div className="p-3 bg-[#a3e635] rounded-2xl shadow-lg shadow-[#a3e635]/20">
                                                <Info size={20} className="text-[#0a1f0a]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                            <div>
                                                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Expected Return</p>
                                                <p className="text-xl md:text-2xl font-black text-[#a3e635]">
                                                    {isPercentage ? `${dailyPayout}%` : formatCurrency(dailyPayout, currency)}
                                                    <span className="text-[10px] ml-1 uppercase font-medium">Daily</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Lock-in Period</p>
                                                <p className="text-xl md:text-2xl font-black text-white">{selectedPlan.durationDays} Days</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Investment Input Area */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] md:text-xs text-gray-500 uppercase font-black tracking-widest">Enter Amount</label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setAmount(planMin.toString())}
                                                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
                                                >
                                                    MIN
                                                </button>
                                                <button
                                                    onClick={() => setAmount(planMax.toString())}
                                                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
                                                >
                                                    MAX
                                                </button>
                                            </div>
                                        </div>
                                        <div className="group relative">
                                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                                <span className="text-xl md:text-2xl font-black text-gray-500 group-focus-within:text-[#a3e635] transition-colors duration-300">
                                                    $
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                autoFocus
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-5 md:py-7 pl-16 pr-6 text-2xl md:text-3xl font-black text-white focus:outline-none focus:border-[#a3e635]/50 focus:bg-[#a3e635]/5 transition-all duration-300 shadow-xl"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Available Range</p>
                                            <p className="text-xs font-medium text-gray-300">
                                                {formatCurrency(planMin, currency)} — {formatCurrency(planMax, currency)}
                                            </p>
                                        </div>

                                        {amount && (
                                            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#a3e635]/5 to-transparent border border-white/5 space-y-3 shadow-lg">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Estimated Daily</span>
                                                    <span className="text-sm font-black text-white">{formatCurrency(estimatedDaily, currency)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Projected</span>
                                                    <span className="text-base font-black text-[#a3e635] drop-shadow-[0_0_10px_rgba(163,230,53,0.3)]">
                                                        +{formatCurrency(estimatedDaily * selectedPlan.durationDays, currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Fixed Footer */}
                {selectedPlan && (
                    <div className="p-5 md:p-6 border-t border-white/10 bg-[#0a1f0a] z-20 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleInvest}
                            disabled={investing || !amount || Number(amount) < planMin || Number(amount) > planMax}
                            className={`w-full py-4 md:py-5 rounded-[1.25rem] font-black text-base md:text-lg transition-all duration-500 relative overflow-hidden group/btn hover:scale-[1.02] active:scale-95 shadow-2xl
                                ${investing || !amount || Number(amount) < planMin || Number(amount) > planMax
                                    ? 'bg-white/5 text-gray-500 cursor-not-allowed grayscale'
                                    : 'bg-[#a3e635] text-[#0a1f0a] hover:shadow-[0_10px_40px_-10px_rgba(163,230,53,0.5)]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {investing ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        PROCESSING...
                                    </>
                                ) : (
                                    <>Confirm Investment</>
                                )}
                            </span>
                        </button>
                        <p className="text-[10px] text-center text-gray-500 uppercase font-black tracking-widest opacity-50">Secure SSL Encrypted Transaction</p>
                    </div>
                )}
            </div>
        </div>
    );
};

InvestModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    initialPlan: PropTypes.object,
};

export default InvestModal;
