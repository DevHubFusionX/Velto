import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, Check, Loader2, TrendingUp, Clock, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { investmentService } from '../services';
import { useCurrency, useAuth } from '../context';
import { formatCurrency } from '../utils';

const InvestModal = ({ onClose, onSuccess, initialPlan }) => {
    const { currency } = useCurrency();
    const { user, checkAuth } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(!initialPlan);
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || null);
    const [amount, setAmount] = useState('');
    const [investing, setInvesting] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(initialPlan ? 2 : 1);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!initialPlan) fetchPlans();
    }, [initialPlan]);

    useEffect(() => {
        if (step === 2 && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [step]);

    useEffect(() => {
        if (selectedPlan) {
            const min = selectedPlan.minAmount || selectedPlan.minInvestment?.usd || 0;
            setAmount(min.toString());
        }
    }, [selectedPlan]);

    const fetchPlans = async () => {
        try {
            const response = await investmentService.getPlans();
            if (response.success) setPlans(response.data);
        } catch {
            setError('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setError('');
        setStep(2);
    };

    const handleInvest = async () => {
        if (!selectedPlan || !amount) return;
        const investmentAmount = Number(amount);
        if (isNaN(investmentAmount) || investmentAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (investmentAmount < planMin) {
            setError(`Minimum investment is ${formatCurrency(planMin, currency)}.`);
            return;
        }
        if (investmentAmount > planMax) {
            setError(`Maximum investment is ${formatCurrency(planMax, currency)}.`);
            return;
        }
        if (user?.totalBalance !== undefined && investmentAmount > user.totalBalance) {
            setError('Insufficient balance.');
            return;
        }
        setInvesting(true);
        setError('');
        try {
            await investmentService.invest({
                planId: selectedPlan.id || selectedPlan._id,
                amount: investmentAmount,
                currency,
            });
            // Re-fetch user from server instead of optimistic client-side update
            await checkAuth();
            onSuccess(investmentAmount, selectedPlan);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Investment failed. Please try again.');
        } finally {
            setInvesting(false);
        }
    };

    const planMin = selectedPlan?.minAmount || selectedPlan?.minInvestment?.usd || 0;
    const planMax = selectedPlan?.maxAmount || selectedPlan?.maxInvestment?.usd || 0;
    const dailyPayout = selectedPlan?.dailyPayout || 0;
    const isPercentage = selectedPlan?.isPercentage !== undefined ? selectedPlan.isPercentage : true;
    const numAmount = Number(amount) || 0;
    const estimatedDaily = selectedPlan && numAmount
        ? (isPercentage ? (numAmount * dailyPayout / 100) : dailyPayout)
        : 0;
    const estimatedTotal = estimatedDaily * (selectedPlan?.durationDays || 0);
    const isValid = numAmount >= planMin && numAmount <= planMax && numAmount > 0;

    const quickAmounts = planMax > 0
        ? [0.25, 0.5, 0.75, 1].map(f => Math.floor(planMin + (planMax - planMin) * f))
        : [];

    return (
        <div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full sm:max-w-lg bg-[#0d1f0d] border border-white/10 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: '92vh', animation: 'modalUp 0.3s cubic-bezier(0.34,1.2,0.64,1)' }}
            >
                <style>{`
                    @keyframes modalUp {
                        from { opacity: 0; transform: translateY(24px) scale(0.98); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes fadeSlide {
                        from { opacity: 0; transform: translateX(16px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                    .step-enter { animation: fadeSlide 0.3s ease forwards; }
                    input[type=number]::-webkit-inner-spin-button,
                    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
                `}</style>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                        {/* Step pills */}
                        <div className="flex items-center gap-1.5">
                            {[1, 2].map(s => (
                                <div key={s} className="flex items-center gap-1.5">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                                            step === s ? 'bg-[#a3e635] text-[#0a1f0a]'
                                            : step > s ? 'bg-[#a3e635]/20 text-[#a3e635]'
                                            : 'bg-white/10 text-gray-500'
                                        }`}
                                    >
                                        {step > s ? <Check size={12} /> : s}
                                    </div>
                                    {s < 2 && <div className={`w-6 h-px transition-colors duration-300 ${step > s ? 'bg-[#a3e635]/40' : 'bg-white/10'}`} />}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-white">
                            {step === 1 ? 'Choose a Plan' : 'Enter Amount'}
                        </span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="animate-spin text-[#a3e635] w-8 h-8" />
                            <p className="text-sm text-gray-500">Loading plans...</p>
                        </div>
                    ) : step === 1 ? (
                        /* ── Step 1: Plan Selection ── */
                        <div className="p-4 space-y-3 step-enter">
                            {plans.map((plan, i) => {
                                const isPopular = i === 1;
                                return (
                                    <button
                                        key={plan._id}
                                        onClick={() => handleSelectPlan(plan)}
                                        className="w-full text-left p-4 rounded-xl border transition-all duration-200 hover:border-[#a3e635]/50 hover:bg-[#a3e635]/5 group relative overflow-hidden"
                                        style={{ borderColor: isPopular ? 'rgba(163,230,53,0.3)' : 'rgba(255,255,255,0.08)', backgroundColor: isPopular ? 'rgba(163,230,53,0.04)' : 'rgba(255,255,255,0.03)' }}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#a3e635]/15 border border-[#a3e635]/30 px-2 py-0.5 rounded-full">
                                                <Zap size={10} className="text-[#a3e635]" />
                                                <span className="text-[10px] font-bold text-[#a3e635]">Popular</span>
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between pr-16">
                                            <div>
                                                <p className="font-bold text-white text-sm group-hover:text-[#a3e635] transition-colors">{plan.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{plan.description || plan.roiDescription}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div>
                                                <p className="text-[10px] text-gray-600 uppercase font-bold">Daily</p>
                                                <p className="text-base font-black text-[#a3e635]">
                                                    {plan.isPercentage ? `${plan.dailyPayout}%` : formatCurrency(plan.dailyPayout, currency)}
                                                </p>
                                            </div>
                                            <div className="w-px h-8 bg-white/10" />
                                            <div>
                                                <p className="text-[10px] text-gray-600 uppercase font-bold">Duration</p>
                                                <p className="text-sm font-bold text-white">{plan.durationDays}d</p>
                                            </div>
                                            <div className="w-px h-8 bg-white/10" />
                                            <div>
                                                <p className="text-[10px] text-gray-600 uppercase font-bold">Min</p>
                                                <p className="text-sm font-bold text-white">{formatCurrency(plan.minAmount || plan.minInvestment?.usd, currency)}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-600 group-hover:text-[#a3e635] ml-auto transition-colors" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        /* ── Step 2: Amount Entry ── */
                        <div className="p-4 space-y-4 step-enter">
                            {/* Selected plan summary chip */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-[#a3e635]/8 border border-[#a3e635]/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#a3e635]/15 flex items-center justify-center">
                                        <TrendingUp size={14} className="text-[#a3e635]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{selectedPlan?.name}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {isPercentage ? `${dailyPayout}% of amount daily` : `$${dailyPayout} fixed/day`}
                                            {' · '}{selectedPlan?.durationDays} days
                                        </p>
                                    </div>
                                </div>
                                {!initialPlan && (
                                    <button
                                        onClick={() => { setStep(1); setSelectedPlan(null); setError(''); }}
                                        className="text-[10px] font-bold text-gray-500 hover:text-[#a3e635] transition-colors uppercase tracking-wide"
                                    >
                                        Change
                                    </button>
                                )}
                            </div>

                            {/* Amount input */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</p>
                                    {user?.totalBalance > 0 && (
                                        <p className="text-[10px] text-gray-600">
                                            Balance: <span className="text-gray-400 font-bold">{formatCurrency(user.totalBalance, currency)}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-500">$</span>
                                    <input
                                        ref={inputRef}
                                        type="number"
                                        value={amount}
                                        onChange={(e) => { setAmount(e.target.value); setError(''); }}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-9 pr-4 text-xl font-black text-white focus:outline-none focus:border-[#a3e635]/50 focus:bg-[#a3e635]/5 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                {/* Range */}
                                <p className="text-[10px] text-gray-600 mt-1.5 px-1">
                                    {formatCurrency(planMin, currency)} – {formatCurrency(planMax, currency)}
                                </p>
                                {/* Quick pick buttons */}
                                {quickAmounts.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {['25%', '50%', '75%', 'Max'].map((label, i) => (
                                            <button
                                                key={label}
                                                onClick={() => setAmount(quickAmounts[i].toString())}
                                                className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-[#a3e635]/10 hover:text-[#a3e635] text-gray-500 text-[11px] font-bold transition-all border border-white/[0.06] hover:border-[#a3e635]/30"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {error && (
                                    <p className="text-xs text-red-400 mt-2 px-1 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Projected returns */}
                            {numAmount > 0 && (
                                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
                                    <div className="px-4 py-2 border-b border-white/[0.05] flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Projected Returns</p>
                                        {!isPercentage && (
                                            <p className="text-[10px] text-gray-600">
                                                Fixed payout · <span className="text-gray-400">{((dailyPayout / numAmount) * 100).toFixed(2)}% effective daily rate</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
                                        <div className="px-4 py-3">
                                            <p className="text-[10px] text-gray-600 mb-1">Daily</p>
                                            <p className="text-sm font-black text-white">{formatCurrency(estimatedDaily, currency)}</p>
                                        </div>
                                        <div className="px-4 py-3">
                                            <p className="text-[10px] text-gray-600 mb-1">Duration</p>
                                            <div className="flex items-center gap-1">
                                                <Clock size={11} className="text-gray-500" />
                                                <p className="text-sm font-black text-white">{selectedPlan?.durationDays}d</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3">
                                            <p className="text-[10px] text-gray-600 mb-1">Total</p>
                                            <p className="text-sm font-black text-[#a3e635]">+{formatCurrency(estimatedTotal, currency)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 2 && (
                    <div className="px-4 pb-5 pt-3 border-t border-white/[0.07] space-y-3">
                        <button
                            onClick={handleInvest}
                            disabled={investing || !isValid}
                            className={`w-full py-4 rounded-xl font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                investing || !isValid
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                                    : 'bg-[#a3e635] text-[#0a1f0a] hover:bg-[#b5f23d] active:scale-[0.98] shadow-lg shadow-[#a3e635]/20'
                            }`}
                        >
                            {investing ? (
                                <><Loader2 size={16} className="animate-spin" /> Processing...</>
                            ) : (
                                <><ShieldCheck size={16} /> Confirm Investment</>
                            )}
                        </button>
                        <p className="text-[10px] text-center text-gray-600">SSL encrypted · Funds secured</p>
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
