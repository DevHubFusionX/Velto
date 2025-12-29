import React, { useState, useEffect } from 'react';
import { X, Calculator, TrendingUp, Info } from 'lucide-react';
import { useCurrency } from '../../context';

const ROISimulatorModal = ({ isOpen, onClose, product }) => {
    const { formatAmount, currency } = useCurrency();
    const [amount, setAmount] = useState(0);
    const [durationMonths, setDurationMonths] = useState(12);

    useEffect(() => {
        if (product) {
            const min = currency === 'USD' ? product.minAmount?.usd : product.minAmount?.ngn;
            if (min) {
                setAmount(min);
            }
            if (product.durationDays) {
                setDurationMonths(Math.round(product.durationDays / 30));
            }
        }
    }, [product, currency]);

    if (!isOpen || !product) return null;

    const returnRate = (product.roiPercent || 0) / 100;
    const monthlyRate = returnRate / 12;
    const profit = amount * monthlyRate * durationMonths;
    const total = amount + profit;

    // Simple growth steps for the graph
    const steps = 6;
    const growthPath = Array.from({ length: steps + 1 }, (_, i) => {
        const stepVal = amount + (profit * (i / steps));
        return { label: `${Math.round((durationMonths / steps) * i)}m`, value: stepVal };
    });

    const maxVal = Math.max(...growthPath.map(s => s.value));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
            <div className="w-full max-w-2xl bg-[#0a1f0a] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(163,230,53,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: product.color }}></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${product.color}20` }}>
                            <Calculator style={{ color: product.color }} size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">ROI Simulator</h2>
                            <p className="text-gray-400 text-sm">Project your earnings for {product.title}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Investment Amount</label>
                                    <span className="text-[#a3e635] font-bold font-mono">{formatAmount(amount)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={currency === 'USD' ? product.minAmount?.usd : product.minAmount?.ngn}
                                    max={currency === 'USD' ? product.maxAmount?.usd : product.maxAmount?.ngn}
                                    step={currency === 'USD' ? 100 : 1000}
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#a3e635]"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Duration (Months)</label>
                                    <span className="text-[#a3e635] font-bold font-mono">{durationMonths} months</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max={Math.round((product.durationDays || 365) / 30 * 2)} // Allow 2x duration for simulation
                                    step="1"
                                    value={durationMonths}
                                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#a3e635]"
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Expected Returns</span>
                                    <span className="text-white font-bold">{product.returns}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                                    <span className="text-gray-500">Estimated Profit</span>
                                    <span className="text-[#a3e635] font-bold">{formatAmount(profit)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total projected value</p>
                                <h3 className="text-4xl font-black text-white mb-2">{formatAmount(total)}</h3>
                                <div className="flex items-center justify-center gap-1 text-[#a3e635] text-xs font-bold">
                                    <TrendingUp size={14} />
                                    +{Math.round((profit / amount) * 100)}% Total Return
                                </div>
                            </div>

                            {/* Growth Mini Visual */}
                            <div className="h-32 flex items-end gap-1 px-4 mt-6">
                                {growthPath.map((step, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-500"
                                            style={{
                                                height: `${(step.value / maxVal) * 100}%`,
                                                backgroundColor: i === growthPath.length - 1 ? product.color : `${product.color}40`
                                            }}
                                        ></div>
                                        <span className="text-[8px] font-bold text-gray-600">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                        <Info size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                        <p className="text-xs text-blue-400/80 leading-relaxed">
                            Projections are based on historical performance and current market rates. Actual returns may vary slightly depending on the exact date of deposit.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ROISimulatorModal;
