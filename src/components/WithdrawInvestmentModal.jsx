import React, { useState } from 'react';
import { X, AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils';
import { useCurrency, useToast } from '../context';
import { investmentService } from '../services';

const WithdrawInvestmentModal = ({ isOpen, onClose, investment, onSuccess }) => {
    const { currency } = useCurrency();
    const { addToast } = useToast();
    const [withdrawing, setWithdrawing] = useState(false);

    if (!isOpen || !investment) return null;

    const penaltyAmount = investment.amount * 0.10;
    const returnAmount = investment.amount - penaltyAmount;

    const handleWithdraw = async () => {
        try {
            setWithdrawing(true);
            const response = await investmentService.withdrawInvestment(investment.id);

            if (response.success) {
                addToast('Investment withdrawn successfully', 'success');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.message || 'Withdrawal failed', 'error');
        } finally {
            setWithdrawing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#1a1c1e] rounded-3xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
                {/* Warning header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <AlertTriangle className="text-amber-500" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Early Withdrawal</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Investment details */}
                <div className="space-y-4 mb-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Investment Amount</p>
                        <p className="text-2xl font-black text-white">{formatCurrency(investment.amount, currency)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <p className="text-xs text-rose-400 uppercase tracking-wider mb-1">Penalty (10%)</p>
                            <p className="text-lg font-bold text-rose-500">-{formatCurrency(penaltyAmount, currency)}</p>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">You Receive</p>
                            <p className="text-lg font-bold text-emerald-500">{formatCurrency(returnAmount, currency)}</p>
                        </div>
                    </div>
                </div>

                {/* Warning message */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                    <p className="text-sm text-amber-200">
                        ⚠️ Withdrawing early will result in a <strong>10% penalty</strong> on your investment. Your returns earned so far will remain in your account.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleWithdraw}
                        disabled={withdrawing}
                        className="flex-1 py-3 px-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {withdrawing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <DollarSign size={18} />
                                Confirm Withdrawal
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawInvestmentModal;
