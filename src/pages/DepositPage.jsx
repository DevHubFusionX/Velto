import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useAuth, useToast } from '../context';
import { userService } from '../services';
import { CreditCard, Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';

const DepositPage = () => {
    const navigate = useNavigate();
    const { currency, formatAmount } = useCurrency();
    const { addToast } = useToast();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [limits, setLimits] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setFetching(true);
            const data = await userService.getSettings();
            setLimits(data.limits.deposit);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setFetching(false);
        }
    };

    const depositMethods = [
        { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="w-6 h-6" />, description: 'Instant funding via Visa or Mastercard' },
        { id: 'transfer', name: 'Bank Transfer', icon: <Landmark className="w-6 h-6" />, description: 'Traditional bank to bank transfer' },
        { id: 'ussd', name: 'USSD Code', icon: <div className="w-6 h-6 flex items-center justify-center font-bold">*</div>, description: 'Quick dial code for mobile banking' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            addToast('Please enter a valid amount', 'error');
            return;
        }

        const min = currency === 'USD' ? limits?.min.usd : limits?.min.ngn;
        const max = currency === 'USD' ? limits?.max.usd : limits?.max.ngn;

        if (numAmount < min) {
            addToast(`Minimum deposit is ${formatAmount(min)}`, 'error');
            return;
        }
        if (numAmount > max) {
            addToast(`Maximum deposit is ${formatAmount(max)}`, 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await userService.deposit(numAmount, method, currency);

            if (response.authorization_url) {
                // If Paystack initialized successfully, redirect to pay
                window.location.href = response.authorization_url;
                return;
            }

            addToast(response.message, 'success');
            setSuccess(true);
        } catch (error) {
            addToast(error.response?.data?.message || 'Deposit failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <DashboardLayout activeItem="dashboard">
                <div className="max-w-xl mx-auto py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#a3e635]/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-[#a3e635]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Deposit Successful!</h1>
                    <p className="text-gray-400 mb-8">Your wallet has been funded with {formatAmount(parseFloat(amount))}.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 rounded-xl bg-[#a3e635] text-[#0a1f0a] font-bold hover:scale-105 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeItem="dashboard">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
                    <p className="text-gray-400">Add money to your wallet to start investing</p>
                </div>

                <div className="p-8 rounded-3xl backdrop-blur-md border bg-white/5 border-white/10 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] rounded-full blur-[100px] opacity-10"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Enter Amount</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-500">
                                    {currency === 'NGN' ? '₦' : '$'}
                                </span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={fetching ? '...' : `Min ${formatAmount(currency === 'USD' ? limits?.min.usd : limits?.min.ngn)}`}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-12 pr-6 text-4xl font-bold text-white focus:outline-none focus:border-[#a3e635]/50 focus:bg-white/10 transition-all placeholder-gray-500"
                                    required
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <span>Limit: {fetching ? '...' : `${formatAmount(currency === 'USD' ? limits?.min.usd : limits?.min.ngn)} - ${formatAmount(currency === 'USD' ? limits?.max.usd : limits?.max.ngn)}`}</span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {[5000, 10000, 50000, 100000].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:text-[#a3e635] hover:border-[#a3e635]/30 transition-all"
                                    >
                                        +{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Select Payment Method</label>
                            <div className="grid gap-4">
                                {depositMethods.map((m) => (
                                    <div
                                        key={m.id}
                                        onClick={() => setMethod(m.id)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 ${method === m.id
                                            ? 'bg-[#a3e635]/10 border-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.1)]'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method === m.id ? 'bg-[#a3e635] text-[#0a1f0a]' : 'bg-white/10 text-white'}`}>
                                            {m.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold ${method === m.id ? 'text-[#a3e635]' : 'text-white'}`}>{m.name}</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                                        </div>
                                        {method === m.id && (
                                            <div className="w-6 h-6 rounded-full bg-[#a3e635] flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-[#0a1f0a] rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-bold text-lg shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        Proceed to Pay {amount ? formatAmount(parseFloat(amount)) : ''}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-4 rounded-2xl bg-white/5 text-gray-400 font-semibold hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                                Cancel Transaction
                            </button>
                        </div>
                    </form>
                </div>

                {/* Secure Trust Indicators */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <Landmark className="w-4 h-4" /> SECURE SSL
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DepositPage;
