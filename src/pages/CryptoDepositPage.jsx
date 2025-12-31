import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCurrency, useToast } from '../context';
import { userService } from '../services';
import {
    ArrowLeft,
    Copy,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    ExternalLink,
    Wallet,
    QrCode
} from 'lucide-react';

const CRYPTO_INFO = {
    BTC: { name: 'Bitcoin', color: '#F7931A', icon: '₿' },
    ETH: { name: 'Ethereum', color: '#627EEA', icon: 'Ξ' },
    BNB: { name: 'BNB', color: '#F3BA2F', icon: 'BNB' },
    USDT_TRC20: { name: 'USDT (TRC20)', color: '#26A17B', icon: '₮' },
    USDT_ERC20: { name: 'USDT (ERC20)', color: '#26A17B', icon: '₮' }
};

const CryptoDepositPage = () => {
    const navigate = useNavigate();
    const { formatAmount } = useCurrency();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [wallets, setWallets] = useState([]);
    const [settings, setSettings] = useState({});
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [copied, setCopied] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null); // NOWPayments response
    const [timer, setTimer] = useState(3600); // 1 hour expiry typically

    const [formData, setFormData] = useState({
        amountUsd: '',
        cryptoAmount: '',
        txHash: ''
    });

    const [manualProof, setManualProof] = useState({
        show: false,
        txHash: '',
        proofUrl: '',
        submitting: false
    });

    useEffect(() => {
        fetchDepositAddresses();
    }, []);

    const fetchDepositAddresses = async () => {
        try {
            setLoading(true);
            const data = await userService.getCryptoDepositAddresses();
            setWallets(data.wallets || []);
            setSettings(data.settings || {});
        } catch (error) {
            console.error('Failed to fetch deposit addresses:', error);
            addToast('Failed to load crypto deposit options', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAddress = () => {
        if (selectedCrypto?.address) {
            navigator.clipboard.writeText(selectedCrypto.address);
            setCopied(true);
            addToast('Address copied to clipboard', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCrypto) {
            addToast('Please select a cryptocurrency', 'error');
            return;
        }

        const amountUsd = parseFloat(formData.amountUsd);
        if (isNaN(amountUsd) || amountUsd < settings.minDeposit) {
            addToast(`Minimum deposit is $${settings.minDeposit}`, 'error');
            return;
        }

        try {
            setSubmitting(true);
            const data = await userService.initiateCryptoDeposit({
                cryptoCurrency: selectedCrypto.currency,
                amountUsd
            });

            setPaymentDetails({
                address: data.payAddress,
                amount: data.payAmount,
                paymentId: data.paymentId,
                transactionId: data.transaction._id,
                currency: selectedCrypto.currency
            });

            addToast('Deposit address generated successfully', 'success');
        } catch (error) {
            addToast(error.response?.data?.message || 'Failed to generate deposit address', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopyValue = (value) => {
        navigator.clipboard.writeText(value);
        addToast('Copied to clipboard', 'success');
    };

    const handleProofUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setManualProof(prev => ({ ...prev, submitting: true }));
            const data = await userService.uploadImage(file);
            setManualProof(prev => ({ ...prev, proofUrl: data.url }));
            addToast('Proof uploaded successfully', 'success');
        } catch (error) {
            addToast('Failed to upload proof', 'error');
        } finally {
            setManualProof(prev => ({ ...prev, submitting: false }));
        }
    };

    const handleManualConfirm = async () => {
        if (!manualProof.txHash && !manualProof.proofUrl) {
            addToast('Please provide a TX Hash or Proof of Payment', 'error');
            return;
        }

        try {
            setManualProof(prev => ({ ...prev, submitting: true }));
            await userService.submitCryptoProof(paymentDetails.transactionId, {
                txHash: manualProof.txHash,
                proofUrl: manualProof.proofUrl
            });
            addToast('Proof submitted for manual verification', 'success');
            setSuccess(true);
        } catch (error) {
            addToast('Failed to submit proof', 'error');
        } finally {
            setManualProof(prev => ({ ...prev, submitting: false }));
        }
    };

    if (loading) {
        return (
            <DashboardLayout activeItem="dashboard">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3e635]"></div>
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
                    <h1 className="text-4xl font-bold text-white mb-4">Deposit Submitted</h1>
                    <p className="text-gray-400 mb-8 text-lg">
                        Your crypto deposit is pending verification. You'll be notified once it's confirmed.
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
            <div className="max-w-4xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/deposit')}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Crypto Deposit</h1>
                        <p className="text-gray-400">Send cryptocurrency to fund your account</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Crypto Selection / Context */}
                    <div className="space-y-4">
                        {!paymentDetails ? (
                            <>
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                    Select Cryptocurrency
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {wallets.map((wallet) => {
                                        const info = CRYPTO_INFO[wallet.currency] || {};
                                        const isSelected = selectedCrypto?.currency === wallet.currency;

                                        return (
                                            <button
                                                key={wallet._id}
                                                onClick={() => setSelectedCrypto(wallet)}
                                                className={`p-4 rounded-2xl border transition-all text-left ${isSelected
                                                    ? 'bg-[#a3e635]/10 border-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.1)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold mb-3"
                                                    style={{ backgroundColor: `${info.color}20`, color: info.color }}
                                                >
                                                    {info.icon}
                                                </div>
                                                <p className={`font-bold ${isSelected ? 'text-[#a3e635]' : 'text-white'}`}>
                                                    {info.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{wallet.network}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center animate-in fade-in slide-in-from-left duration-500">
                                <div className="w-20 h-20 rounded-full bg-[#a3e635]/10 flex items-center justify-center mx-auto mb-6">
                                    <QrCode className="w-10 h-10 text-[#a3e635]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Awaiting Transfer</h3>
                                <p className="text-gray-400 mb-6">Generated deposit order for {CRYPTO_INFO[paymentDetails.currency]?.name}</p>

                                <div className="space-y-4 text-left">
                                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-sm font-bold text-amber-500 uppercase tracking-wider">Awaiting Confirmation</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Payment ID</p>
                                        <p className="text-sm font-mono text-white">{paymentDetails.paymentId}</p>
                                    </div>

                                    {!manualProof.show ? (
                                        <button
                                            onClick={() => setManualProof(prev => ({ ...prev, show: true }))}
                                            className="w-full py-4 rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/20 text-[#a3e635] text-xs font-black uppercase tracking-widest hover:bg-[#a3e635]/20 transition-all"
                                        >
                                            I have paid already
                                        </button>
                                    ) : (
                                        <div className="space-y-4 pt-4 border-t border-white/5 animate-in slide-in-from-top duration-300">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">
                                                    Transaction Hash (TXID)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={manualProof.txHash}
                                                    onChange={(e) => setManualProof(prev => ({ ...prev, txHash: e.target.value }))}
                                                    placeholder="Enter transaction hash"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-700 focus:border-[#a3e635]/50 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">
                                                    Proof of Payment (Screenshot)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        onChange={handleProofUpload}
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="proof-upload"
                                                    />
                                                    <label
                                                        htmlFor="proof-upload"
                                                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-[#a3e635]/50 hover:bg-white/5 cursor-pointer transition-all"
                                                    >
                                                        {manualProof.proofUrl ? (
                                                            <div className="flex items-center gap-2 text-[#a3e635] text-xs font-bold">
                                                                <CheckCircle2 size={16} />
                                                                Proof Uploaded
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <QrCode size={20} className="text-gray-500 mb-1" />
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Upload Screenshot</span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleManualConfirm}
                                                disabled={manualProof.submitting || (!manualProof.txHash && !manualProof.proofUrl)}
                                                className="w-full py-4 rounded-xl bg-[#a3e635] text-[#0a1f0a] font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(163,230,53,0.2)] disabled:opacity-50 transition-all"
                                            >
                                                {manualProof.submitting ? 'Submitting...' : 'Confirm Submission'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {wallets.length === 0 && !loading && (
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                <p className="text-gray-400">No crypto wallets configured yet.</p>
                                <p className="text-xs text-gray-500 mt-2">Please contact support.</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Payment Details or Info */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
                        {paymentDetails ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Transaction Invoice</h4>
                                    <div className="px-3 py-1 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/20 text-[#a3e635] text-[10px] font-bold uppercase tracking-widest">
                                        SECURE ESCROW
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Amount Row */}
                                    <div className="p-6 rounded-2xl bg-[#a3e635]/5 border border-[#a3e635]/10 relative group">
                                        <p className="text-xs text-[#a3e635] font-black uppercase tracking-[0.2em] mb-2">Exact Amount to Send</p>
                                        <div className="flex items-end justify-between">
                                            <span className="text-3xl font-black text-white tracking-tight">
                                                {paymentDetails.amount} <span className="text-[#a3e635] text-xl font-bold">{paymentDetails.currency}</span>
                                            </span>
                                            <button
                                                onClick={() => handleCopyValue(paymentDetails.amount)}
                                                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-[#a3e635] transition-all active:scale-95"
                                            >
                                                <Copy size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Address Row */}
                                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-3">Deposit Address</p>
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between gap-4 mb-4">
                                            <span className="text-xs font-mono text-gray-300 break-all leading-relaxed">
                                                {paymentDetails.address}
                                            </span>
                                            <button
                                                onClick={() => handleCopyValue(paymentDetails.address)}
                                                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all flex-shrink-0"
                                            >
                                                <Copy size={20} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-amber-500/80 font-medium bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                                            <AlertCircle size={14} />
                                            <span>Send only via <span className="font-bold uppercase">{selectedCrypto?.network || 'selected'}</span> network. Correct amount ensures instant credit.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => setPaymentDetails(null)}
                                        className="w-full py-4 rounded-xl border border-white/10 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Cancel Transaction
                                    </button>
                                </div>
                            </div>
                        ) : selectedCrypto ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="mb-8">
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-2">Selected Asset</p>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 flex items-center justify-center text-[#a3e635] text-xl font-bold">
                                            {CRYPTO_INFO[selectedCrypto.currency]?.icon}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{CRYPTO_INFO[selectedCrypto.currency]?.name}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold font-mono">{selectedCrypto.network}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-[0.2em]">
                                        Amount to Deposit (USD)
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-2xl font-black group-focus-within:text-[#a3e635] transition-colors">$</span>
                                        <input
                                            type="number"
                                            value={formData.amountUsd}
                                            onChange={(e) => setFormData({ ...formData, amountUsd: e.target.value })}
                                            placeholder="100.00"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-6 pl-12 pr-6 text-white text-3xl font-black placeholder-gray-800 transition-all focus:border-[#a3e635]/50 focus:ring-0"
                                            min={settings.minDeposit || 10}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-between mt-3 px-1">
                                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Min: ${settings.minDeposit || 10}</p>
                                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Max: $100,000</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting || !formData.amountUsd}
                                        className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#a3e635] to-[#84cc16] text-[#0a1f0a] font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                                    >
                                        {submitting ? (
                                            <div className="w-6 h-6 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Generate Invoice
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                                <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-700 mb-8 rotate-12">
                                    <Wallet size={48} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-[0.1em] mb-2">Select an Asset</h4>
                                <p className="text-gray-500 max-w-[240px] text-sm font-medium leading-relaxed">Choose your preferred cryptocurrency to generate a secure deposit gateway.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CryptoDepositPage;
