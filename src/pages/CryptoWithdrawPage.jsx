import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useToast } from '../context';
import { userService } from '../services';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Wallet, ShieldCheck, Lock, Sparkles } from 'lucide-react';

const USDT_NETWORKS = [
    { currency: 'USDT_TRC20', label: 'USDT — TRC20 (Tron)', network: 'TRC20', fee: 'Low fee ~$1', color: '#26A17B', placeholder: 'T...' },
    { currency: 'USDT_ERC20', label: 'USDT — ERC20 (Ethereum)', network: 'ERC20', fee: 'Higher gas fee', color: '#627EEA', placeholder: '0x...' }
];

const CryptoWithdrawPage = () => {
    const navigate = useNavigate();
    const { formatAmount } = useCurrency();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [balance, setBalance] = useState(0);
    const [lockedBalance, setLockedBalance] = useState(0);
    const [settings, setSettings] = useState({ minWithdrawal: 20, maxWithdrawal: 50000 });
    const [step, setStep] = useState(1);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ amountUsd: '', cryptoAddress: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [dash, walletData] = await Promise.all([
                userService.getDashboard(),
                userService.getCryptoDepositAddresses()
            ]);
            setBalance(dash.totalBalance || 0);
            setLockedBalance(dash.lockedBalance || 0);
            if (walletData.settings) setSettings(walletData.settings);
        } catch {
            addToast('Failed to load wallet data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const amount = parseFloat(form.amountUsd);
        if (!selected) return addToast('Select a network', 'error');
        if (!amount || amount < settings.minWithdrawal) return addToast(`Minimum withdrawal is $${settings.minWithdrawal}`, 'error');
        if (amount > settings.maxWithdrawal) return addToast(`Maximum withdrawal is $${settings.maxWithdrawal}`, 'error');
        if (amount > balance) return addToast('Insufficient funds', 'error');
        if (!form.cryptoAddress.trim()) return addToast('Enter your USDT wallet address', 'error');

        try {
            setSubmitting(true);
            await userService.requestCryptoWithdrawal({
                cryptoCurrency: selected.currency,
                cryptoAddress: form.cryptoAddress.trim(),
                amountUsd: amount,
                network: selected.network
            });
            setSuccess(true);
        } catch (err) {
            addToast(err.response?.data?.message || 'Submission failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <DashboardLayout activeItem="dashboard">
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3e635]" />
            </div>
        </DashboardLayout>
    );

    if (success) return (
        <DashboardLayout activeItem="dashboard">
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-lg w-full p-10 text-center rounded-3xl bg-white/5 border border-white/10">
                    <div className="w-24 h-24 rounded-3xl bg-[#a3e635]/20 flex items-center justify-center mx-auto mb-8 border border-[#a3e635]/30">
                        <CheckCircle2 className="w-12 h-12 text-[#a3e635]" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 uppercase">Withdrawal Queued</h1>
                    <p className="text-gray-400 text-lg mb-10">
                        Your withdrawal of <span className="text-white font-bold">${form.amountUsd}</span> USDT ({selected?.network}) is being processed.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="w-full py-5 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black text-lg uppercase tracking-wider">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout activeItem="dashboard">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck size={16} className="text-[#a3e635]" />
                                <span className="text-[10px] font-bold text-[#a3e635] uppercase tracking-[0.3em]">Secure Terminal</span>
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">USDT Withdrawal</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {[1, 2].map(i => (
                            <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#a3e635]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Balance Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 border-l-4 border-l-[#a3e635]">
                            <div className="flex items-center gap-3 mb-4 text-gray-400">
                                <Wallet size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Available Balance</span>
                            </div>
                            <div className="text-4xl font-black text-white">{formatAmount(balance)}</div>
                            <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                                <Sparkles size={10} /> Fully Liquid
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 opacity-60">
                            <div className="flex items-center gap-3 mb-4 text-gray-400">
                                <Lock size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Locked Assets</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-300">{formatAmount(lockedBalance)}</div>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="lg:col-span-8">
                        {step === 1 ? (
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 uppercase">Select Network & Amount</h3>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {USDT_NETWORKS.map(opt => {
                                        const isSelected = selected?.currency === opt.currency;
                                        return (
                                            <button key={opt.currency} onClick={() => setSelected(opt)}
                                                className={`p-4 rounded-2xl border text-left transition-all ${isSelected ? 'bg-[#a3e635]/10 border-[#a3e635]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-2"
                                                    style={{ backgroundColor: `${opt.color}20`, color: opt.color }}>₮</div>
                                                <p className={`font-bold text-sm ${isSelected ? 'text-[#a3e635]' : 'text-white'}`}>{opt.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{opt.fee}</p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Amount (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-500">$</span>
                                        <input type="number" value={form.amountUsd} onChange={e => setForm({ ...form, amountUsd: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-[#0a1f0a]/50 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-3xl font-bold text-white outline-none focus:border-[#a3e635] transition-colors" />
                                    </div>
                                    <div className="flex justify-between mt-2 px-1">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Min: ${settings.minWithdrawal}</p>
                                        {parseFloat(form.amountUsd) > balance ? (
                                            <p className="text-rose-400 text-xs flex items-center gap-1 font-bold uppercase tracking-widest">
                                                <AlertCircle size={12} /> Insufficient funds
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Max: ${settings.maxWithdrawal}</p>
                                        )}
                                    </div>
                                </div>

                                <button onClick={() => setStep(2)}
                                    disabled={!selected || !form.amountUsd || parseFloat(form.amountUsd) > balance}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-black text-lg uppercase shadow-[0_0_40px_rgba(163,230,53,0.2)] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2">
                                    Continue <ArrowRight size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 uppercase">Your USDT Wallet Address</h3>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                        {selected?.label} Address
                                    </label>
                                    <input type="text" value={form.cryptoAddress} onChange={e => setForm({ ...form, cryptoAddress: e.target.value })}
                                        placeholder={selected?.placeholder || 'Paste your USDT address'}
                                        className="w-full bg-[#0a1f0a]/50 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono outline-none focus:border-[#a3e635] transition-colors" />
                                    <p className="text-xs text-amber-500/80 mt-2 flex items-center gap-1">
                                        <AlertCircle size={12} /> Ensure this is a valid {selected?.network} address. Wrong address = lost funds.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#a3e635]/5 border border-[#a3e635]/10 mb-6 space-y-2">
                                    {[
                                        ['Amount', `$${form.amountUsd}`],
                                        ['Network', selected?.network],
                                        ['Currency', 'USDT']
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between">
                                            <span className="text-gray-400">{label}</span>
                                            <span className="text-white font-bold">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl bg-white/5 text-gray-400 font-bold uppercase border border-white/5">
                                        Back
                                    </button>
                                    <button onClick={handleSubmit} disabled={submitting || !form.cryptoAddress}
                                        className="flex-[2] py-5 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black text-lg uppercase shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                        {submitting ? <div className="w-6 h-6 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin" /> : <><ShieldCheck size={20} /> Confirm Withdrawal</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CryptoWithdrawPage;
