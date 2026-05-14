import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../context';
import { userService } from '../services';
import { ArrowLeft, Copy, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

const USDT_NETWORKS = {
    USDT_TRC20: { label: 'USDT — TRC20 (Tron)', network: 'TRC20', fee: 'Low fee ~$1', color: '#26A17B' },
    USDT_ERC20: { label: 'USDT — ERC20 (Ethereum)', network: 'ERC20', fee: 'Higher gas fee', color: '#627EEA' }
};

const CryptoDepositPage = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [wallets, setWallets] = useState([]);
    const [settings, setSettings] = useState({});
    const [selected, setSelected] = useState(null);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({ amountUsd: '', txHash: '' });

    useEffect(() => { fetchWallets(); }, []);

    const fetchWallets = async () => {
        try {
            const data = await userService.getCryptoDepositAddresses();
            setWallets(data.wallets || []);
            setSettings(data.settings || {});
        } catch {
            addToast('Failed to load deposit addresses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        addToast('Address copied', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selected) return addToast('Select a network', 'error');
        const amount = parseFloat(form.amountUsd);
        if (!amount || amount < (settings.minDeposit || 10)) return addToast(`Minimum deposit is $${settings.minDeposit || 10}`, 'error');
        if (!form.txHash.trim()) return addToast('Transaction hash is required', 'error');

        try {
            setSubmitting(true);
            await userService.initiateCryptoDeposit({ cryptoCurrency: selected.currency, amountUsd: amount, txHash: form.txHash.trim() });
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
            <div className="max-w-xl mx-auto py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-[#a3e635]/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-[#a3e635]" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Deposit Submitted</h1>
                <p className="text-gray-400 mb-8">Your deposit is pending admin verification. You'll be notified once confirmed.</p>
                <button onClick={() => navigate('/dashboard')} className="px-8 py-3 rounded-xl bg-[#a3e635] text-[#0a1f0a] font-bold hover:scale-105 transition-all">
                    Return to Dashboard
                </button>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout activeItem="dashboard">
            <div className="max-w-2xl mx-auto py-8 px-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back
                </button>

                <h1 className="text-3xl font-black text-white mb-2">USDT <span className="text-[#a3e635]">Deposit</span></h1>
                <p className="text-gray-400 mb-8 text-sm">Send USDT to the address below, then submit your transaction hash for verification.</p>

                {/* Step 1: Select Network */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">1. Select Network</p>
                    <div className="grid grid-cols-2 gap-3">
                        {wallets.map(wallet => {
                            const info = USDT_NETWORKS[wallet.currency];
                            const isSelected = selected?.currency === wallet.currency;
                            return (
                                <button key={wallet._id} onClick={() => setSelected(wallet)}
                                    className={`p-4 rounded-2xl border text-left transition-all ${isSelected ? 'border-[#a3e635] bg-[#a3e635]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-2"
                                        style={{ backgroundColor: `${info?.color}20`, color: info?.color }}>₮</div>
                                    <p className={`font-bold text-sm ${isSelected ? 'text-[#a3e635]' : 'text-white'}`}>{info?.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{info?.fee}</p>
                                </button>
                            );
                        })}
                        {wallets.length === 0 && (
                            <div className="col-span-2 p-8 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No deposit addresses configured. Contact support.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 2: Wallet Address */}
                {selected && (
                    <div className="mb-6 animate-in fade-in duration-300">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">2. Send USDT to this address</p>
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <p className="font-mono text-sm text-gray-200 break-all leading-relaxed">{selected.address}</p>
                                <button onClick={() => handleCopy(selected.address)}
                                    className="flex-shrink-0 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    {copied ? <CheckCircle2 size={18} className="text-[#a3e635]" /> : <Copy size={18} className="text-gray-400" />}
                                </button>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                                <AlertCircle size={13} className="flex-shrink-0" />
                                Send only USDT via <strong>{selected.network}</strong> network. Wrong network = lost funds.
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Submit Form */}
                {selected && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">3. Confirm your deposit</p>

                        <div>
                            <label className="block text-xs text-gray-400 mb-2 font-medium">Amount Sent (USD equivalent)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input type="number" value={form.amountUsd} onChange={e => setForm({ ...form, amountUsd: e.target.value })}
                                    placeholder="0.00" min={settings.minDeposit || 10} required
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-5 text-white font-bold focus:border-[#a3e635] outline-none transition-colors" />
                            </div>
                            <p className="text-xs text-gray-600 mt-1 ml-1">Min: ${settings.minDeposit || 10}</p>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-2 font-medium">Transaction Hash (TX ID)</label>
                            <input type="text" value={form.txHash} onChange={e => setForm({ ...form, txHash: e.target.value })}
                                placeholder="Paste your blockchain TX hash here" required
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-white font-mono text-sm focus:border-[#a3e635] outline-none transition-colors" />
                            <div className="flex items-center justify-between mt-1 ml-1">
                                <p className="text-xs text-gray-600">Find this in your wallet's transaction history</p>
                                <a
                                    href={selected?.network === 'TRC20'
                                        ? 'https://tronscan.org/#/address'
                                        : 'https://etherscan.io/address'}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-[#a3e635]/70 hover:text-[#a3e635] transition-colors flex items-center gap-1">
                                    Find on {selected?.network === 'TRC20' ? 'Tronscan' : 'Etherscan'} ↗
                                </a>
                            </div>
                        </div>

                        <button type="submit" disabled={submitting}
                            className="w-full py-4 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black uppercase tracking-wider shadow-[0_0_30px_rgba(163,230,53,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                            {submitting ? <div className="w-5 h-5 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin" /> : 'Submit Deposit'}
                        </button>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CryptoDepositPage;
