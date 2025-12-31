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
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10 sm:mb-12 animate-in fade-in slide-in-from-top duration-700">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                            Crypto <span className="text-[#a3e635]">Deposit</span>
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                            Securely fund your account using your preferred cryptocurrency. <br className="hidden sm:block" />
                            Transactions are verified automatically on the blockchain.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* Left: Crypto Selection */}
                        <div className="lg:col-span-5 space-y-4">
                            {!paymentDetails ? (
                                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-1 border border-white/10 shadow-2xl">
                                    <div className="p-4 sm:p-6 mb-2">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                            Select Asset
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium">Choose a network to deposit</p>
                                    </div>

                                    <div className="space-y-2 px-2 pb-2">
                                        {wallets.map((wallet) => {
                                            const info = CRYPTO_INFO[wallet.currency] || {};
                                            const isSelected = selectedCrypto?.currency === wallet.currency;

                                            return (
                                                <button
                                                    key={wallet._id}
                                                    onClick={() => setSelectedCrypto(wallet)}
                                                    className={`w-full group p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${isSelected
                                                        ? 'bg-[#a3e635] border-[#a3e635] shadow-[0_0_30px_rgba(163,230,53,0.3)]'
                                                        : 'bg-white/5 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 ${isSelected ? 'bg-black/20 text-[#0a1f0a]' : 'bg-white/5 text-white'
                                                            }`} style={!isSelected ? { color: info.color } : {}}>
                                                            {info.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={`text-base font-bold ${isSelected ? 'text-[#0a1f0a]' : 'text-white'}`}>
                                                                {info.name}
                                                            </p>
                                                            <p className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-[#0a1f0a]/60' : 'text-gray-500'}`}>
                                                                {wallet.network}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="ml-auto bg-[#0a1f0a]/10 p-2 rounded-full">
                                                                <CheckCircle2 size={16} className="text-[#0a1f0a]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}

                                        {wallets.length === 0 && !loading && (
                                            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">No assets available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#a3e635] rounded-3xl p-6 sm:p-8 text-[#0a1f0a] shadow-[0_0_50px_rgba(163,230,53,0.2)] dark-pattern relative overflow-hidden h-full min-h-[400px] flex flex-col justify-between animate-in fade-in slide-in-from-left duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#0a1f0a] flex items-center justify-center mb-6 shadow-xl">
                                            <QrCode className="w-8 h-8 text-[#a3e635]" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-2 leading-none">Scan<br />to Pay</h3>
                                        <p className="text-[#0a1f0a]/60 font-medium text-sm max-w-[200px] mb-8">
                                            Use your crypto wallet app to scan and complete the transfer.
                                        </p>

                                        <div className="bg-[#0a1f0a]/10 rounded-2xl p-4 backdrop-blur-sm border border-[#0a1f0a]/5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Time Remaining</p>
                                            <div className="text-2xl font-black font-mono">
                                                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 pt-8">
                                        <div className="flex items-center gap-2 text-sm font-bold opacity-60">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                            Do not close this window
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Payment Details or Amount Input */}
                        <div className="lg:col-span-7">
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
                                {paymentDetails ? (
                                    <div className="flex-1 p-6 sm:p-10 flex flex-col animate-in fade-in slide-in-from-right duration-500">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Payment Invoice</h4>
                                            <button
                                                onClick={() => setPaymentDetails(null)}
                                                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                                            >
                                                <ArrowLeft size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-6 flex-1">
                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Send Exact Amount</p>
                                                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-[#a3e635]/30 transition-colors cursor-pointer" onClick={() => handleCopyValue(paymentDetails.amount)}>
                                                    <span className="text-3xl sm:text-4xl font-black text-[#a3e635] tracking-tight">{paymentDetails.amount}</span>
                                                    <span className="text-xl font-bold text-gray-500">{paymentDetails.currency}</span>
                                                    <Copy size={18} className="text-gray-600 ml-auto group-hover:text-white transition-colors" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Deposit Address</p>
                                                <div className="bg-black/40 p-5 rounded-3xl border border-white/5 group hover:border-[#a3e635]/30 transition-colors cursor-pointer relative overflow-hidden" onClick={() => handleCopyValue(paymentDetails.address)}>
                                                    <p className="font-mono text-sm sm:text-base text-gray-300 break-all leading-relaxed relative z-10">{paymentDetails.address}</p>
                                                    <div className="absolute right-4 bottom-4 text-gray-700 group-hover:text-white transition-colors">
                                                        <Copy size={20} />
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                                                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                                    <span>Send only <b>{selectedCrypto?.currency}</b> via the <b>{selectedCrypto?.network}</b> network.</span>
                                                </div>
                                            </div>

                                            {!manualProof.show ? (
                                                <button
                                                    onClick={() => setManualProof(prev => ({ ...prev, show: true }))}
                                                    className="w-full mt-auto py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    <span>I have completed payment</span>
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            ) : (
                                                <div className="space-y-4 pt-6 mt-auto border-t border-white/5 animate-in slide-in-from-bottom duration-300">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Proof of Payment</label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                value={manualProof.txHash}
                                                                onChange={(e) => setManualProof(prev => ({ ...prev, txHash: e.target.value }))}
                                                                placeholder="Paste TX Hash"
                                                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#a3e635] outline-none transition-colors"
                                                            />
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    onChange={handleProofUpload}
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    id="proof-upload-btn"
                                                                />
                                                                <label
                                                                    htmlFor="proof-upload-btn"
                                                                    className={`flex items-center justify-center gap-2 h-full rounded-xl border border-dashed cursor-pointer transition-all text-xs font-bold ${manualProof.proofUrl
                                                                            ? 'bg-[#a3e635]/10 border-[#a3e635] text-[#a3e635]'
                                                                            : 'border-white/20 text-gray-400 hover:border-white/40 hover:bg-white/5'
                                                                        }`}
                                                                >
                                                                    {manualProof.proofUrl ? 'Uploaded' : 'Upload Image'}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleManualConfirm}
                                                        disabled={manualProof.submitting || (!manualProof.txHash && !manualProof.proofUrl)}
                                                        className="w-full py-4 rounded-xl bg-[#a3e635] text-[#0a1f0a] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                                    >
                                                        {manualProof.submitting ? 'Verifying...' : 'Confirm Deposit'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
                                        {selectedCrypto ? (
                                            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in zoom-in duration-300">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-[#a3e635] border border-white/10">
                                                        {CRYPTO_INFO[selectedCrypto.currency]?.icon}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-1">Deposit {CRYPTO_INFO[selectedCrypto.currency]?.name}</h3>
                                                    <p className="text-gray-500 text-sm">Enter the amount in USD</p>
                                                </div>

                                                <div className="relative group max-w-sm mx-auto w-full">
                                                    <label className="block text-xs font-black text-gray-500 mb-4 uppercase tracking-[0.2em] text-center">Amount (USD)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-500 group-focus-within:text-[#a3e635] transition-colors">$</span>
                                                        <input
                                                            type="number"
                                                            value={formData.amountUsd}
                                                            onChange={(e) => setFormData({ ...formData, amountUsd: e.target.value })}
                                                            placeholder="0.00"
                                                            className="w-full bg-black/40 border-2 border-white/10 rounded-3xl py-6 pl-12 pr-6 text-center text-3xl font-black text-white focus:border-[#a3e635] focus:outline-none focus:ring-4 focus:ring-[#a3e635]/10 transition-all placeholder-gray-800"
                                                            min={settings.minDeposit || 10}
                                                            required
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                                        <span>Min: ${settings.minDeposit || 10}</span>
                                                        <span>Max: $100,000</span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={submitting || !formData.amountUsd}
                                                    className="w-full max-w-sm mx-auto py-5 rounded-2xl bg-[#a3e635] text-[#0a1f0a] font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_40px_rgba(163,230,53,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(163,230,53,0.5)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                                                >
                                                    {submitting ? (
                                                        <div className="w-5 h-5 border-2 border-[#0a1f0a] border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            Proceed to Payment
                                                            <ArrowRight size={18} />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="text-center opacity-40">
                                                <Wallet size={64} className="mx-auto mb-6 text-gray-500" />
                                                <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Start Here</h3>
                                                <p className="text-gray-400 font-medium">Select a cryptocurrency from the list<br />to begin your deposit.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CryptoDepositPage;
