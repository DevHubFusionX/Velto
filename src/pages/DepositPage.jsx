import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useAuth, useToast } from '../context';
import { userService } from '../services';
import { CreditCard, Landmark, ArrowRight, CheckCircle2, Upload, DollarSign, X } from 'lucide-react';

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
    const [proofFile, setProofFile] = useState(null); // File object
    const [proof, setProof] = useState(null); // Preview URL or uploaded URL

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
        {
            id: 'card',
            name: 'Credit / Debit Card',
            icon: <CreditCard className="w-6 h-6" />,
            description: 'Instant funding via Visa or Mastercard'
        },
        {
            id: 'transfer',
            name: 'Bank Transfer',
            icon: <Landmark className="w-6 h-6" />,
            description: 'Traditional bank to bank transfer'
        },
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProof(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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

        if (method === 'transfer' && !proofFile) {
            addToast('Please upload proof of payment', 'error');
            return;
        }

        try {
            setLoading(true);
            let finalProofUrl = proof; // Default to current state (base64 preview) fallback, but logic below replaces it

            if (method === 'transfer' && proofFile) {
                // Upload image first
                const uploadResponse = await userService.uploadImage(proofFile);
                finalProofUrl = uploadResponse.url;
            }

            const response = await userService.deposit(numAmount, method, currency, finalProofUrl);

            if (response.authorization_url) {
                window.location.href = response.authorization_url;
                return;
            }

            addToast(response.message, 'success');
            setSuccess(true);
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Deposit failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <DashboardLayout activeItem="dashboard">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (success) {
        return (
            <DashboardLayout activeItem="dashboard">
                <div className="max-w-xl mx-auto py-20 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#a3e635]/20 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-12 h-12 text-[#a3e635]" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Deposit Initiated</h1>
                    <p className="text-gray-400 mb-8 text-lg">
                        {method === 'transfer'
                            ? `Your manual deposit request of ${formatAmount(parseFloat(amount))} has been submitted. Admin verification required.`
                            : `Your secured transaction of ${formatAmount(parseFloat(amount))} has been initiated.`}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 rounded-xl bg-[#a3e635] text-[#0a1f0a] font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeItem="dashboard">
            <div className="max-w-3xl mx-auto pb-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
                    <p className="text-gray-400">Add money to your wallet to start investing securely.</p>
                </div>

                <div className="p-8 rounded-3xl backdrop-blur-md border bg-white/5 border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635] rounded-full blur-[120px] opacity-[0.05] pointer-events-none"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                        {/* Amount Input Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Enter Amount</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-500 group-focus-within:text-[#a3e635] transition-colors">
                                    {currency === 'USD' ? '$' : '₦'}
                                </span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={fetching ? '...' : `Min ${limits ? (currency === 'USD' ? limits.min.usd : limits.min.ngn) : '0'}`}
                                    className="w-full bg-[#0a1f0a]/50 border border-white/10 rounded-2xl py-6 pl-12 pr-6 text-4xl font-bold text-white focus:outline-none focus:border-[#a3e635]/50 focus:bg-[#0a1f0a]/80 transition-all placeholder-gray-600"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                                {[5000, 10000, 50000, 100000].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmount(val.toString())}
                                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-400 hover:text-[#a3e635] hover:border-[#a3e635]/30 hover:bg-[#a3e635]/5 transition-all whitespace-nowrap"
                                    >
                                        +{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {limits && (
                                <p className="mt-3 text-xs font-medium text-gray-500">
                                    Limits: <span className="text-gray-300">{formatAmount(currency === 'USD' ? limits.min.usd : limits.min.ngn)}</span> - <span className="text-gray-300">{formatAmount(currency === 'USD' ? limits.max.usd : limits.max.ngn)}</span>
                                </p>
                            )}
                        </div>

                        {/* Payment Method Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Select Payment Method</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {depositMethods.map((m) => (
                                    <div
                                        key={m.id}
                                        onClick={() => setMethod(m.id)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group ${method === m.id
                                            ? 'bg-[#a3e635]/10 border-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.1)]'
                                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${method === m.id ? 'bg-[#a3e635] text-[#0a1f0a]' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                                            {m.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold transition-colors ${method === m.id ? 'text-[#a3e635]' : 'text-white'}`}>{m.name}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{m.description}</p>
                                        </div>
                                        {method === m.id && (
                                            <div className="w-6 h-6 rounded-full bg-[#a3e635] flex items-center justify-center shadow-lg shadow-[#a3e635]/20">
                                                <div className="w-2.5 h-2.5 bg-[#0a1f0a] rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bank Transfer Details & Upload */}
                        {method === 'transfer' && (
                            <div className="bg-[#0a1f0a]/40 p-6 rounded-2xl border border-white/10 animate-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-[#a3e635]">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-white text-lg">Bank Account Details</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</p>
                                        <p className="font-mono text-lg text-white font-bold select-all">Velto Bank</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Number</p>
                                        <p className="font-mono text-lg text-[#a3e635] font-bold select-all">123 456 7890</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Name</p>
                                        <p className="font-mono text-lg text-white font-bold select-all">Velto Global Investments Ltd</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                                        Upload Proof of Payment
                                    </label>

                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${proof
                                            ? 'border-[#a3e635] bg-[#a3e635]/5'
                                            : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.07]'
                                            }`}>
                                            {proof ? (
                                                <div className="relative z-10">
                                                    <img src={proof} alt="Proof" className="h-32 rounded-lg object-cover shadow-lg border border-white/20" />
                                                    <div className="mt-2 text-center">
                                                        <span className="text-xs font-bold text-[#a3e635] flex items-center justify-center gap-1">
                                                            <CheckCircle2 size={12} /> Image Selected
                                                        </span>
                                                        <p className="text-[10px] text-gray-400 mt-1">Click to replace</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-gray-500 mb-3 group-hover:scale-110 transition-transform group-hover:text-[#a3e635]" />
                                                    <p className="text-sm font-bold text-gray-300">Click to upload screenshot</p>
                                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || (method === 'transfer' && !proof)}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-bold text-lg shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(163,230,53,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Proceed to {method === 'transfer' ? 'Confirm' : 'Pay'} {amount ? formatAmount(parseFloat(amount)) : ''}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full mt-4 py-4 rounded-2xl bg-white/5 text-gray-400 font-semibold hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            >
                                Cancel Transaction
                            </button>
                        </div>
                    </form>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <div className="p-1.5 bg-white/10 rounded-full">
                            <Landmark size={14} />
                        </div>
                        BANK LEVEL SECURITY
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <div className="p-1.5 bg-white/10 rounded-full">
                            <CheckCircle2 size={14} />
                        </div>
                        SSL ENCRYPTED
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DepositPage;
