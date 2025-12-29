import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useAuth, useToast } from '../context';
import { userService } from '../services';
import {
    ArrowLeft,
    Landmark,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Wallet,
    Lock,
    Building2,
    CreditCard,
    User,
    ChevronRight,
    Sparkles
} from 'lucide-react';

const WithdrawPage = () => {
    const navigate = useNavigate();
    const { currency, formatAmount } = useCurrency();
    const { addToast } = useToast();
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [lockedBalance, setLockedBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountName: ''
    });

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            setFetching(true);
            const data = await userService.getDashboard();
            setBalance(data.totalBalance);
            setLockedBalance(data.lockedBalance || 0);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleWithdraw = async (e) => {
        if (e) e.preventDefault();
        const numAmount = parseFloat(amount);

        if (numAmount > balance) {
            addToast('Insufficient funds', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await userService.withdraw(numAmount, bankDetails, currency);
            addToast(response.message, 'success');
            setSuccess(true);
        } catch (error) {
            addToast(error.response?.data?.message || 'Withdrawal failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    };

    if (success) {
        return (
            <DashboardLayout activeItem="dashboard">
                <div className="min-h-[80vh] flex items-center justify-center p-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-lg w-full premium-card p-10 text-center relative overflow-hidden"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a3e635] to-transparent opacity-50"></div>
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a3e635]/10 rounded-full blur-[80px]"></div>

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#a3e635]/20 to-transparent flex items-center justify-center mx-auto mb-8 border border-[#a3e635]/30 shadow-[0_0_30px_rgba(163,230,53,0.2)]"
                            >
                                <CheckCircle2 className="w-12 h-12 text-[#a3e635]" />
                            </motion.div>

                            <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Capital Released</h1>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                Your withdrawal of <span className="text-white font-bold">{formatAmount(parseFloat(amount))}</span> has been successfully queued for clearance. Funds typically arrive within <span className="text-[#a3e635] font-semibold">24 business hours</span>.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Method</p>
                                    <p className="text-sm font-bold text-white uppercase">{bankDetails.bankName}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Queue ID</p>
                                    <p className="text-sm font-bold text-white uppercase">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-5 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black text-lg uppercase tracking-wider shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Return to Command
                            </button>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeItem="dashboard">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(-1)}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md"
                        >
                            <ArrowLeft size={24} />
                        </motion.button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck size={16} className="text-[#a3e635]" />
                                <span className="text-[10px] font-bold text-[#a3e635] uppercase tracking-[0.3em]">Secure Terminal</span>
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Capital Withdrawal</h1>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#a3e635] shadow-[0_0_10px_rgba(163,230,53,0.5)]' : 'bg-white/10'}`} />
                                {i === 1 && <ChevronRight size={14} className="text-gray-600" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Stats & Context */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="premium-card p-6 border-l-4 border-l-[#a3e635]"
                        >
                            <div className="flex items-center gap-3 mb-4 text-gray-400">
                                <Wallet size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Available Capital</span>
                            </div>
                            <div className="text-4xl font-black text-white tracking-tight mb-2">
                                {fetching ? (
                                    <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg" />
                                ) : (
                                    formatAmount(balance)
                                )}
                            </div>
                            <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles size={10} /> Fully Liquid
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="premium-card p-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3 mb-4 text-gray-400">
                                <Lock size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Locked Assets</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-300 tracking-tight">
                                {fetching ? (
                                    <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                                ) : (
                                    formatAmount(lockedBalance)
                                )}
                            </div>
                            <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-widest mt-2">In Clearance Queue</p>
                        </motion.div>

                        <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Security Notice</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Withdrawals are processed through encrypted channels. Ensure your bank details are accurate to avoid clearance delays.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Flow Content */}
                    <div className="lg:col-span-12 xl:col-span-8">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={containerVariants}
                                    className="premium-card p-10 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635]/5 rounded-full blur-[100px]"></div>

                                    <div className="relative z-10 space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Amount to Withdraw</h3>
                                            <p className="text-sm text-gray-500">Specify the capital magnitude for release.</p>
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#a3e635]/10 to-transparent rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl"></div>
                                            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-3xl p-8 focus-within:border-[#a3e635]/50 transition-all">
                                                <span className="text-5xl font-black text-gray-700 mr-4">
                                                    {currency === 'NGN' ? '₦' : '$'}
                                                </span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-transparent border-none text-5xl font-black text-white focus:outline-none placeholder-gray-800"
                                                />
                                            </div>

                                            {parseFloat(amount) > balance && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 mt-4 text-rose-400 text-sm font-bold uppercase tracking-wider"
                                                >
                                                    <AlertCircle size={16} />
                                                    <span>Magnitude exceeds liquidity limits</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[0.25, 0.5, 0.75, 1].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setAmount((balance * p).toFixed(0))}
                                                    className="py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-[#a3e635]/10 hover:text-[#a3e635] hover:border-[#a3e635]/30 transition-all"
                                                >
                                                    {p * 100}% Liquid
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setStep(2)}
                                            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                                            className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(163,230,53,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                                        >
                                            Proceed to Route Selection
                                            <ArrowRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="step2"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={containerVariants}
                                    onSubmit={handleWithdraw}
                                    className="premium-card p-10 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>

                                    <div className="relative z-10 space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Destination Route</h3>
                                            <p className="text-sm text-gray-500">Define the bank protocol for receiving capital.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Building2 size={12} /> Target Bank
                                                </label>
                                                <select
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:outline-none focus:border-[#a3e635]/50 appearance-none cursor-pointer"
                                                    value={bankDetails.bankName}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                                    required
                                                >
                                                    <option value="" className="bg-[#0a1f0a]">Initialize Selection</option>
                                                    <option value="GTBank" className="bg-[#0a1f0a]">Guaranty Trust Bank</option>
                                                    <option value="Zenith Bank" className="bg-[#0a1f0a]">Zenith Bank PLC</option>
                                                    <option value="Access Bank" className="bg-[#0a1f0a]">Access Bank Corp</option>
                                                    <option value="Kuda Bank" className="bg-[#0a1f0a]">Kuda Microfinance</option>
                                                    <option value="Wema Bank (ALAT)" className="bg-[#0a1f0a]">Wema / ALAT</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <CreditCard size={12} /> Account Number
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength="10"
                                                    placeholder="0000000000"
                                                    value={bankDetails.accountNumber}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold tracking-[0.5em] focus:outline-none focus:border-[#a3e635]/50 placeholder-gray-800"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <User size={12} /> Account Identity
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="FULL LEGAL NAME"
                                                    value={bankDetails.accountName}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold uppercase tracking-widest focus:outline-none focus:border-[#a3e635]/50 placeholder-gray-800"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-[#a3e635]/5 border border-[#a3e635]/10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 flex items-center justify-center">
                                                    <ShieldCheck className="text-[#a3e635]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#a3e635] uppercase tracking-widest">Total Release</p>
                                                    <p className="text-xl font-black text-white uppercase">{formatAmount(parseFloat(amount))}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-5 rounded-2xl bg-white/5 text-gray-400 font-black text-xs uppercase tracking-[0.2em] border border-white/5 hover:bg-white/10 transition-all"
                                            >
                                                Adjust Amount
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-[2] py-5 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black text-lg uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Clearing...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        Initialize Clearance
                                                        <ShieldCheck className="w-6 h-6" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6 text-gray-600">
                    <div className="h-[1px] w-12 bg-gray-800"></div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <Landmark size={14} />
                        Authorized Financial Protocol
                    </div>
                    <div className="h-[1px] w-12 bg-gray-800"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .premium-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 2rem;
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
                }
            `}} />
        </DashboardLayout>
    );
};

export default WithdrawPage;
